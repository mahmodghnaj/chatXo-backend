import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { AppLoggerMiddleware } from './middleware/AppLoggerMiddleware';
import { PaginationMiddleware } from './middleware/pagination.middleware';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoPlugin = require('./utilities/common/mongo-plugin');
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATA_BASE, {
      connectionFactory: (connection) => {
        connection.plugin(mongoPlugin);
        return connection;
      },
    }),
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
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
    consumer.apply(PaginationMiddleware).forRoutes('*');
  }
}
