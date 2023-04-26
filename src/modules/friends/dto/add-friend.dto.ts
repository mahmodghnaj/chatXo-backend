import { IsNotEmpty, IsMongoId } from 'class-validator';
export class AddFriendDto {
  @IsMongoId()
  @IsNotEmpty()
  idFriend: string;
}
