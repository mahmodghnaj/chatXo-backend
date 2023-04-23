import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.body.email && !request.body.passport) {
      throw new HttpException('Email and password  should not be empty', 400);
    }
    if (!request.body.email) {
      throw new HttpException('Email should not be empty', 400);
    }
    if (!request.body.password) {
      throw new HttpException('Password should not be empty', 400);
    }

    return super.canActivate(context);
  }
}
