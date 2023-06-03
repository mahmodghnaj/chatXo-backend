import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Friends } from 'src/modules/friends/schemas/friends.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;
  @Prop({})
  lastName: string;
  @Prop({ unique: true })
  email: string;
  @Prop({ select: false })
  password: string;
  @Prop({ select: false })
  refreshToken: string;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Friends' })
  friends: Array<Friends>;
  @Prop({ enum: ['Online', 'Offline'], default: 'Offline' })
  status: string;
  @Prop()
  lastSeenAt: Date;
  @Prop()
  socialId: string;
  @Prop()
  socialType: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
