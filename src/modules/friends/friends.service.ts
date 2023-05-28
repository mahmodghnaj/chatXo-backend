import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Friends } from './schemas/friends.schema';
@Injectable()
export class FriendsService {
  constructor(
    @InjectModel('Friends') private friendsModel: Model<Friends>,
    private usersService: UsersService,
  ) {}

  async addFriend(userId, friendId) {
    if (userId == friendId) {
      throw new WsException("Can't Add Self");
    }
    const docA = await this.friendsModel
      .findOneAndUpdate(
        { requester: userId, recipient: friendId },
        { $set: { status: 1 } },
        { upsert: true, new: true },
      )
      .populate('requester')
      .populate('recipient');
    const docB = await this.friendsModel
      .findOneAndUpdate(
        { recipient: userId, requester: friendId },
        { $set: { status: 2 } },
        { upsert: true, new: true },
      )
      .populate('requester')
      .populate('recipient');
    await this.usersService.update(userId, {
      $addToSet: { friends: docA._id },
    });
    await this.usersService.update(friendId, {
      $addToSet: { friends: docB._id },
    });
    return {
      friendRequester: docA,
      friendRecipient: docB,
    };
  }
  async acceptFriend(userId, friendId) {
    const docA = await this.friendsModel.findOneAndUpdate(
      { requester: userId, recipient: friendId },
      { $set: { status: 3 } },
    );
    if (!docA) throw new WsException('Friend Not Found');
    const docB = await this.friendsModel.findOneAndUpdate(
      { recipient: userId, requester: friendId },
      { $set: { status: 3 } },
    );
    if (!docB) throw new WsException('Friend Not Found');
    return {
      friendRequester: { id: docA.id },
      friendRecipient: { id: docB.id },
    };
  }
  async rejectFriend(userId, friendId) {
    const docA = await this.friendsModel.findOneAndRemove({
      requester: userId,
      recipient: friendId,
    });
    if (!docA) throw new WsException('Friend Not Found');
    const docB = await this.friendsModel.findOneAndRemove({
      recipient: userId,
      requester: friendId,
    });
    if (!docB) throw new HttpException('Friend Not Found', 400);
    await this.usersService.update(userId, { $pull: { friends: docA._id } });
    await this.usersService.update(friendId, { $pull: { friends: docB._id } });

    return {
      friendRequester: { id: docA.id },
      friendRecipient: { id: docB.id },
    };
  }
}
