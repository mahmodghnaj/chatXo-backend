import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
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
import { MappingFriendDto } from './dto/add-friend.dto';
import { FriendsService } from './friends.service';

@UseFilters(new WebsocketExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class FriendsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly friendsService: FriendsService,
  ) {}
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
    this.connectedUsers.delete(client.id);
  }
  @SubscribeMessage('mappingFriend')
  async mapping(client: Socket, mappingFriendDto: MappingFriendDto) {
    const userId = this.connectedUsers.get(client.id);
    const friendId = mappingFriendDto.idFriend;
    const type = mappingFriendDto.type;
    const idSocketFriend = getKeyByValue(this.connectedUsers, friendId);

    let res;
    if (type === 'accept') {
      res = await this.friendsService.acceptFriend(userId, friendId);
    } else if (type === 'reject') {
      res = await this.friendsService.rejectFriend(userId, friendId);
    } else if (type === 'add') {
      res = await this.friendsService.addFriend(userId, friendId);
    }
    res.type = type;
    if (idSocketFriend) {
      this.server
        .to(client.id)
        .emit('mappingFriend', { ...res, friendRecipient: undefined });
      this.server
        .to(idSocketFriend)
        .emit('mappingFriend', { ...res, friendRequester: undefined });
    } else {
      console.log('dd');
      delete res.recipient;
      this.server
        .to(client.id)
        .emit('mappingFriend', { ...res, friendRecipient: undefined });
    }
  }
}
