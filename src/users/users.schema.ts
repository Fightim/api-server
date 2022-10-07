import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: String })
  accessKey: string;

  @Prop({ required: false, type: String })
  secret: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  instances: [mongoose.Schema.Types.ObjectId];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  loadBalancers: [mongoose.Schema.Types.ObjectId];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  rds: [mongoose.Schema.Types.ObjectId];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: [Date], default: [Date.now()] })
  loginAt: [Date];
}

export const UserSchema = SchemaFactory.createForClass(User);
