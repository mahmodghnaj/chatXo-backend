import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddMessageDto {
  @IsNotEmpty()
  @IsString()
  text: string;
  @IsNotEmpty()
  @IsMongoId()
  roomId: string;
  @IsOptional()
  @IsMongoId()
  userId?: string;
}
