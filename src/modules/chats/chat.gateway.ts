import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket) {
    throw new Error('Method not implemented.');
  }
  handleDisconnect(client: Socket) {
    throw new Error('Method not implemented.');
  }
}
