import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { MongoExceptionFilter } from './filters/mongo-exception-filter';
import { WebsocketExceptionsFilter } from './filters/ws-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(), new MongoExceptionFilter());
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
