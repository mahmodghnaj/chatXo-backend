import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';
@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    switch (exception.code) {
      case 11000:
        response.status(409).json({
          statusCode: 409,
          message: 'Email Already Exists',
        });
        break;
      default:
        response.status(409).json({
          statusCode: 409,
          message: exception.message,
        });
    }
  }
}
