import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { ChatsModule } from './modules/chats/chats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { RoomModule } from './modules/room/room.module';
import { FriendsModule } from './modules/friends/friends.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATA_BASE),
    FriendsModule,
    UsersModule,
    ChatsModule,
    AuthModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
