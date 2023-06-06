import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Request } from 'express';
dotenv.config();
@Injectable()
export class SessionStrategy extends PassportStrategy(Strategy, 'session') {
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([ //don't use please write commit in line 38 in auth.controller
      //   (request: Request) => {
      //     const data = request?.cookies['refresh'];
      //     if (data == null) {
      //       return null;
      //     }
      //     return data;
      //   },
      // ]),
    });
  }
  async validate(payload: any) {
    return payload;
  }
}
