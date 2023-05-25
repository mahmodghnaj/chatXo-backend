import { Body, Controller, Patch, Post, Request } from '@nestjs/common';
import { AddFriendDto } from './dto/add-friend.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}
  @Post('add')
  addFriend(@Request() req, @Body() body: AddFriendDto) {
    return this.friendsService.addFriend(req.user.id, body.idFriend);
  }
  @Patch('accept')
  acceptFriend(@Request() req, @Body() body: AddFriendDto) {
    return this.friendsService.acceptFriend(req.user.id, body.idFriend);
  }
  @Patch('reject')
  rejectFriend(@Request() req, @Body() body: AddFriendDto) {
    return this.friendsService.rejectFriend(req.user.id, body.idFriend);
  }
}
