import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
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
    // receiver is online
    if (receiverId)
      this.server.to(receiverId).to(client.id).emit('message', {
        message,
        idRoom: addMessageDto.room,
      });
    else {
      this.server.to(client.id).emit('message', {
        message,
        idRoom: addMessageDto.room,
      });
    }
  }
  private notifyConnectedUsers({ id, status, lastSeenAt }) {
    // Send a notification to other connected sockets
    this.connectedUsers.forEach((connectedUserId, key) => {
      if (connectedUserId !== id) {
        this.server.to(key).emit('statusUser', { id, status, lastSeenAt });
      }
    });
  }
}
