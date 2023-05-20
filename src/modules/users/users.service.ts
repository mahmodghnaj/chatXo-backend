import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('Users') private usersModel: Model<User>) {}

  async create(body: CreateUserDto) {
    const hash = bcrypt.hashSync(body.password, 5);
    body.password = hash;
    const createdUser = new this.usersModel(body);
    return createdUser.save();
  }
  findAll() {
    return `This action returns all users`;
  }
  async findOne(body: object) {
    const user = await this.usersModel.findOne(body);

    return user;
  }
  async validateUser(body: object) {
    const user = await this.usersModel
      .findOne(body)
      .select('+password +refreshToken')
      .exec();
    return user;
  }

  async update(id: string, updateUserDto) {
    const user = await this.usersModel.findByIdAndUpdate(id, updateUserDto);
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
