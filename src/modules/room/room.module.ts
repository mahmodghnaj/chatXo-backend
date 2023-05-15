import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MessageSchema } from './schemas/message.schema';
import { RoomSchema } from './schemas/room.schema';

@Module({
  exports: [RoomService],
  controllers: [RoomController],
  providers: [RoomService],
  imports: [
    MongooseModule.forFeature([{ schema: RoomSchema, name: 'Rooms' }]),
    MongooseModule.forFeature([{ schema: MessageSchema, name: 'Messages' }]),
    UsersModule,
  ],
})
export class RoomModule {}
