import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WebsocketExceptionsFilter } from 'src/filters/ws-exception-filter';
import { AuthService } from '../auth/auth.service';

@UseFilters(new WebsocketExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer()
  server;
  connectedUsers: Map<string, string> = new Map();
  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    const user = this.authService.verifyAccessToken(token);
    if (!user) {
      client.disconnect(true);
      return;
    }
    this.connectedUsers.set(client.id, user.id);
  }
  async handleDisconnect(client) {
    const userId: string = this.connectedUsers.get(client.id);
    this.connectedUsers.delete(client.id);
  }
}
