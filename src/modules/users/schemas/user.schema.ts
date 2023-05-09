import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Friends } from 'src/modules/friends/schemas/friends.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  refreshToken: string;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Friends' })
  friends: Array<Friends>;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id.toString();
    delete object._id;
    delete object.__v;
  },
});