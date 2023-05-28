import { IsNotEmpty, IsMongoId } from 'class-validator';
export class MappingFriendDto {
  @IsMongoId()
  @IsNotEmpty()
  idFriend: string;
  @IsNotEmpty()
  type: 'add' | 'reject' | 'accept';
}
