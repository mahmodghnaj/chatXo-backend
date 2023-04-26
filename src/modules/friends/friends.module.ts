import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { FriendsSchema } from './schemas/friends.schema';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ schema: FriendsSchema, name: 'Friends' }]),
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
