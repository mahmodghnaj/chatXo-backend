import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type FriendsDocument = HydratedDocument<Friends>;

@Schema({ timestamps: true })
export class Friends {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  requester: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  recipient: User;
  @Prop({ enum: [0, 1, 2, 3] })
  //0- 'add friend',
  //2-'requested',
  //2-'pending',
  //3-'friends'
  status: number;
}
export const FriendsSchema = SchemaFactory.createForClass(Friends);
