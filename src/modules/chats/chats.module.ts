import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RoomModule } from '../room/room.module';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [],
  imports: [AuthModule, UsersModule, RoomModule],
  providers: [ChatGateway],
})
export class ChatsModule {}
