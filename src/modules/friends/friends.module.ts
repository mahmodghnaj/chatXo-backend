import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendsService } from './friends.service';
import { FriendsSchema } from './schemas/friends.schema';
import { UsersModule } from 'src/modules/users/users.module';
import { FriendsGateway } from './friends.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([{ schema: FriendsSchema, name: 'Friends' }]),
  ],
  controllers: [],
  providers: [FriendsService, FriendsGateway],
})
export class FriendsModule {}
