import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Room } from './room.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  text: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' })
  room: Room;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id.toString();
    delete object._id;
    delete object.__v;
  },
});
