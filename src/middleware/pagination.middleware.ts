import { Injectable, NestMiddleware } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { PaginationValidationPipe } from 'src/dto/pagination.dto';
@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  async use(req, res: Response, next: NextFunction) {
    const { page, limit } = await new PaginationValidationPipe().transform(
      req.query,
    );
    req.query = { ...req.query, page, limit };
    next();
  }
}
