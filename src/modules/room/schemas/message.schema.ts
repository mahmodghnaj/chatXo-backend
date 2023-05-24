import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { Room, RoomDocument } from './room.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  text: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user: RoomDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' })
  room: RoomDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  receiver: UserDocument;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
