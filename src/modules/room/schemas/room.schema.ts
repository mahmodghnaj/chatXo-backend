import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Message } from './message.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user: User[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Messages' })
  messages: Message[];
}
export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id.toString();
    delete object._id;
    delete object.__v;
  },
});
