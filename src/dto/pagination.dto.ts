import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class PaginationValidationPipe implements PipeTransform<any> {
  async transform(value: any) {
    const page = parseInt(value.page, 10) || 1;
    const limit = parseInt(value.limit, 10) || 50;

    if (page < 1) {
      throw new BadRequestException('Page must be greater than or equal to 1');
    }

    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    return { page, limit };
  }
}
