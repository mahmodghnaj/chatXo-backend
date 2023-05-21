import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Message } from './message.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user1: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user2: User;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Messages',
    nullable: true,
  })
  lastMessage: Message[] | null;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
