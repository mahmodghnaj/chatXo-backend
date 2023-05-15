import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreatedRoomDto {
  @IsMongoId()
  @IsNotEmpty()
  user: string;
}
