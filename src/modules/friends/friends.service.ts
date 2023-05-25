import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
      throw new HttpException("Can't Add Self", 400);
    }
    const docA = await this.friendsModel.findOneAndUpdate(
      { requester: userId, recipient: friendId },
      { $set: { status: 1 } },
      { upsert: true, new: true },
    );
    const docB = await this.friendsModel.findOneAndUpdate(
      { recipient: userId, requester: friendId },
      { $set: { status: 2 } },
      { upsert: true, new: true },
    );
    await this.usersService.update(userId, {
      $addToSet: { friends: docA._id },
    });
    await this.usersService.update(friendId, {
      $addToSet: { friends: docB._id },
    });
    return 'ok';
  }
  async acceptFriend(userId, friendId) {
    const docA = await this.friendsModel.findOneAndUpdate(
      { requester: userId, recipient: friendId },
      { $set: { status: 3 } },
    );
    if (!docA) throw new HttpException('Friend Not Found', 400);
    const docB = await this.friendsModel.findOneAndUpdate(
      { recipient: userId, requester: friendId },
      { $set: { status: 3 } },
    );
    if (!docB) throw new HttpException('Friend Not Found', 400);
    return {
      friendId: friendId,
    };
  }
  async rejectFriend(userId, friendId) {
    const docA = await this.friendsModel.findOneAndRemove({
      requester: userId,
      recipient: friendId,
    });
    if (!docA) throw new HttpException('Friend Not Found', 400);
    const docB = await this.friendsModel.findOneAndRemove({
      recipient: userId,
      requester: friendId,
    });
    if (!docB) throw new HttpException('Friend Not Found', 400);
    await this.usersService.update(userId, { $pull: { friends: docA._id } });
    await this.usersService.update(friendId, { $pull: { friends: docB._id } });
    return {
      friendId: friendId,
    };
  }
}
