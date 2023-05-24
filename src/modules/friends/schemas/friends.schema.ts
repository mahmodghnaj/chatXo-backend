import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';

export type FriendsDocument = HydratedDocument<Friends>;

@Schema({ timestamps: true })
export class Friends {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  requester: UserDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  recipient: UserDocument;
  @Prop({
    enums: [
      0, //'add friend',
      1, //'requested',
      2, //'pending',
      3, //'friends'
    ],
  })
  status: number;
}
export const FriendsSchema = SchemaFactory.createForClass(Friends);
