import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
dotenv.config();
@Injectable()
export class RefreshToken extends PassportStrategy(Strategy, 'refresh-token') {
  constructor() {
    super({
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
      ignoreExpiration: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // const data = request?.cookies['refreshToken'];
          const data = request.body?.refreshToken;
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
    });
  }
  validate(req: Request, payload: any) {
    // const refreshToken = req?.cookies['refreshToken'];
    const refreshToken = req.body?.refreshToken;
    payload.refreshToken = refreshToken;
    return payload;
  }
}
