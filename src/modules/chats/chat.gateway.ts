import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WebsocketExceptionsFilter } from 'src/filters/ws-exception-filter';
import { getKeyByValue } from 'src/utilities/common/helper';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../room/room.service';
import { UsersService } from '../users/users.service';
import { AddMessageDto } from './dto/add-message.dto';

@UseFilters(new WebsocketExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly roomService: RoomService,
  ) {}

  @WebSocketServer()
  server;

  connectedUsers: Map<string, string> = new Map();

  /**
   * Handle a new socket connection.
   * @param client - The socket client object.
   */
  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    const payload = this.authService.verifyAccessToken(token);
    const user =
      payload &&
      (await this.userService.update(payload.id, {
        status: 'Online',
      }));

    if (!user) {
      client.disconnect(true);
      return;
    }

    this.connectedUsers.set(client.id, user.id);
    await this.roomService.markMessagesAsReceived(user.id);

    this.notifyConnectedUsers({
      id: user.id,
      status: 'Online',
      lastSeenAt: undefined,
    });
  }

  /**
   * Handle a socket disconnection.
   * @param client - The socket client object.
   */
  async handleDisconnect(client) {
    const userId: string = this.connectedUsers.get(client.id);
    await this.userService.update(userId, {
      status: 'Offline',
      lastSeenAt: new Date(),
    });

    this.connectedUsers.delete(client.id);
    this.notifyConnectedUsers({
      id: userId,
      status: 'Offline',
      lastSeenAt: new Date(),
    });
  }

  /**
   * Handle a message event from a socket client.
   * @param client - The socket client object.
   * @param addMessageDto - The DTO containing the message data.
   */
  @SubscribeMessage('message')
  async onMessage(client: Socket, addMessageDto: AddMessageDto) {
    const userId = this.connectedUsers.get(client.id);
    const receiverId = getKeyByValue(
      this.connectedUsers,
      addMessageDto.receiver,
    );
    addMessageDto.user = userId;
    addMessageDto.received = receiverId ? true : false;

    const message = await this.roomService.addMessage(addMessageDto);

    await this.roomService.update(addMessageDto.room, {
      lastMessage: message,
      updatedAt: new Date(),
    });

    // Receiver is online
    if (receiverId) {
      this.server.to(receiverId).to(client.id).emit('message', {
        message,
        idRoom: addMessageDto.room,
      });
    } else {
      this.server.to(client.id).emit('message', {
        message,
        idRoom: addMessageDto.room,
      });
    }
  }

  @SubscribeMessage('deleteAllRooms')
  async deleteRooms(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    const rooms = await this.roomService.deleteRoomsAndMessagesByUserId(userId);
    const receivers = rooms.map((item) => ({
      id: item.id,
      user: item.user1.id == userId ? item.user2 : item.user1,
    }));
    receivers.forEach((element) => {
      const receiverId = getKeyByValue(this.connectedUsers, element.user.id);
      if (receiverId) {
        this.server.to(receiverId).emit('deleteChat', element);
      }
    });
    this.server.to(client.id).emit('deleteAllChat');
  }

  @SubscribeMessage('deleteChat')
  async deleteChat(client: Socket, id: string) {
    if (!id) throw new WsException('Please Pass Id');

    const userId = this.connectedUsers.get(client.id);
    const room = await this.roomService.deleteById(id);
    const receiver = room.user1.id == userId ? room.user2 : room.user1;
    const receiverId = getKeyByValue(this.connectedUsers, receiver.id);

    if (receiverId) {
      this.server
        .to(receiverId)
        .emit('deleteChat', { id: room.id, user: receiver });
    }
    this.server
      .to(client.id)
      .emit('deleteChat', { id: room.id, user: receiver });
  }
  /**
   * Send a notification to connected users about the status change.
   * @param id - The ID of the user whose status changed.
   * @param status - The new status of the user.
   * @param lastSeenAt - The timestamp of the user's last seen activity.
   */
  private notifyConnectedUsers({ id, status, lastSeenAt }) {
    // Send a notification to other connected sockets
    this.connectedUsers.forEach((connectedUserId, key) => {
      if (connectedUserId !== id) {
        this.server.to(key).emit('statusUser', { id, status, lastSeenAt });
      }
    });
  }
}
