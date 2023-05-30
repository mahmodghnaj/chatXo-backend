import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddMessageDto } from '../chats/dto/add-message.dto';
import { UsersService } from '../users/users.service';
import { Message, MessageDocument } from './schemas/message.schema';
import { Room, RoomDocument } from './schemas/room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Rooms') private roomsModel: Model<Room>,
    @InjectModel('Messages') private messagesModel: Model<Message>,
    private usersService: UsersService,
  ) {}
  async createRoom(body): Promise<any> {
    if (body.user1 == body.user2)
      throw new HttpException("Can't Add Room With Mine", 400);
    const user = await this.usersService.findOne({ _id: body.user2 });
    if (!user) throw new HttpException('User Not Found', 400);
    const promise1 = this.roomsModel.findOne({
      user1: body.user1,
      user2: body.user2,
    });
    const promise2 = this.roomsModel.findOne({
      user1: body.user2,
      user2: body.user1,
    });
    const room: RoomDocument[] = await Promise.all([promise1, promise2]);
    if (room.filter((item) => item).length)
      throw new HttpException('Room Between Users Already Found', 400);
    const createdRoom = new this.roomsModel(body);
    await createdRoom.populate('user2');
    const res: RoomDocument = await createdRoom.save();
    return {
      id: res.id,
      user: res.user2,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  }
  async addMessage(body: AddMessageDto): Promise<MessageDocument> {
    const createdMessage = new this.messagesModel(body);
    return await createdMessage.save();
  }
  async getRooms(query, userId) {
    const { page, limit, total } = query;
    const skip = (page - 1) * limit;
    const data = await this.roomsModel
      .find({
        $or: [{ user1: userId }, { user2: userId }],
      })
      .populate('user1')
      .populate('user2')
      .populate('lastMessage')
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });
    let allTotal;
    if (total) {
      allTotal = await this.roomsModel.countDocuments({
        $or: [{ user1: userId }, { user2: userId }],
      });
    }
    return {
      data: data.map((item) => ({
        id: item.id,
        user: userId == item.user1._id ? item.user2 : item.user1,
        lastMessage: item.lastMessage,
      })),
      total: allTotal,
    };
  }

  async update(id: string, updateRoomDto) {
    const room = await this.roomsModel.findByIdAndUpdate(id, updateRoomDto);
    return room;
  }
  async getMessagesChat(id, query) {
    const { page, limit, total } = query;
    const skip = (page - 1) * limit;
    const data = await this.messagesModel
      .find({ room: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    let allTotal;
    if (total) {
      allTotal = await this.messagesModel.countDocuments({ room: id });
    }
    return {
      data,
      total: allTotal,
    };
  }
  async checkRoom(friendId, userId) {
    const room: RoomDocument = await this.roomsModel
      .findOne({
        $or: [
          { user1: friendId, user2: userId },
          { user1: userId, user2: friendId },
        ],
      })
      .populate('user1')
      .populate('user2');

    return {
      room: room
        ? {
            id: room.id,
            user: userId == room.user1._id ? room.user2 : room.user1,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
          }
        : null,
    };
  }
  async findOne(id: string, userId: string) {
    const res = await this.roomsModel
      .findById(id)
      .populate('user1')
      .populate('user2')
      .populate('lastMessage');
    if (res.user1.id == userId || res.user2.id == userId)
      return {
        id: res.id,
        user: userId == res.user1.id ? res.user2 : res.user1,
        lastMessage: res.lastMessage,
      };
    throw new HttpException('this is room is private', 400);
  }
  async markMessagesAsReceived(receiverId: string): Promise<string> {
    await this.messagesModel.updateMany(
      { receiver: receiverId, received: false },
      { $set: { received: true } },
    );

    return 'ok';
  }
}
