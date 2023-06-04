import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategie/local.strategy';
import { JwtStrategy } from './strategie/jwt.strategy';
import { RefreshToken } from './strategie/refresh-token';
import { GithubStrategy } from './strategie/github.strategy';
import { GoogleStrategy } from './strategie/google.strategy';
import { SessionStrategy } from './strategie/session.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshToken,
    GithubStrategy,
    GoogleStrategy,
    SessionStrategy,
  ],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
