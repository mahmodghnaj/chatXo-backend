import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddMessageDto {
  @IsNotEmpty()
  @IsString()
  text: string;
  @IsNotEmpty()
  @IsMongoId()
  room: string;
  @IsNotEmpty()
  @IsMongoId()
  receiver: string;
  @IsOptional()
  @IsMongoId()
  user?: string;
  @IsOptional()
  received?: boolean;
}
