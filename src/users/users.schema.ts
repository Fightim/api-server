import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  accessKey: string;

  @Prop()
  secret: string;

  @Prop()
  instances: [mongoose.Schema.Types.ObjectId];

  @Prop()
  loadBalancers: [mongoose.Schema.Types.ObjectId];

  @Prop()
  rds: [mongoose.Schema.Types.ObjectId];

  @Prop()
  createdAt: Date;

  @Prop()
  loginAt: [Date];
}

export const UserSchema = SchemaFactory.createForClass(User);
