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
      payload && (await this.userService.findOne({ _id: payload.id }));
    if (!user) {
      client.disconnect(true);
      return;
    }

    this.connectedUsers.set(client.id, user.id);
  }
  handleDisconnect(client) {
    this.connectedUsers.delete(client.id);
  }
  @SubscribeMessage('message')
  async onMessage(client: Socket, addMessageDto: AddMessageDto) {
    const userId = this.connectedUsers.get(client.id);
    addMessageDto.userId = userId;
    await this.roomService.addMessage(addMessageDto);
    this.server.to(client.id).emit('message', addMessageDto.text);
  }
}
