import { Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { SafeMongoIdTransform } from 'src/decorators/safe-mongoId-transform';

export class OnlyIDParamDTO {
  @IsMongoId()
  @IsString()
  @Transform((value) => SafeMongoIdTransform(value))
  id: string;
}
