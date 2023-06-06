import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('Users') private usersModel: Model<User>) {}

  /**
   * Create a new user.
   * @param body - User data.
   * @returns The created user.
   */
  async create(body: CreateUserDto): Promise<UserDocument> {
    const hash = bcrypt.hashSync(body.password, 5);
    body.password = hash;
    const createdUser = new this.usersModel(body);
    return createdUser.save();
  }

  /**
   * Find a user based on the provided query.
   * @param body - Query parameters.
   * @returns The found user.
   */
  async findOne(body: object) {
    const user = await this.usersModel.findOne(body).populate({
      path: 'friends',
      populate: {
        path: 'requester recipient',
        model: 'Users',
        select: 'firstName lastName email status lastSeenAt',
      },
    });

    return user;
  }

  /**
   * Validate and find a user based on the provided query.
   * @param body - Query parameters.
   * @returns The found user.
   */
  async validateUser(body: object): Promise<UserDocument> {
    const user = await this.usersModel
      .findOne(body)
      .select('+password +refreshToken')
      .exec();
    return user;
  }

  /**
   * Update a user based on the provided ID and data.
   * @param id - User ID.
   * @param updateUserDto - User data to update.
   * @returns The updated user.
   */
  async update(id: string, updateUserDto): Promise<UserDocument> {
    const user = await this.usersModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    return user;
  }

  /**
   * Search for users based on the provided query and exclude the current user.
   * @param query - Search query.
   * @param userId - Current user ID.
   * @returns An object containing the search result.
   */
  async searchUsers(query: string, userId: string): Promise<{ data: User[] }> {
    if (!query)
      return {
        data: [],
      };
    const users = await this.usersModel.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
      ],
    });
    return {
      data: users.filter((item) => item.id != userId),
    };
  }
}
