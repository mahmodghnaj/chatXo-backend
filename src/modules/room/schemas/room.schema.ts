import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/modules/users/schemas/user.schema';
import { Message, MessageDocument } from './message.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user1: UserDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user2: UserDocument;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Messages',
    nullable: true,
  })
  lastMessage: MessageDocument[] | null;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
