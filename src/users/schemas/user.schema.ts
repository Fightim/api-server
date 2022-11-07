import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
    required: false,
    type: String,
    default: null,
  })
  accessKey: string | null;

  @Prop({
    required: false,
    type: String,
    default: null,
  })
  secret: string | null;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instance' }],
    default: [],
  })
  frontendInstances: mongoose.Schema.Types.ObjectId[];

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instance' }],
    default: [],
  })
  backendInstances: mongoose.Schema.Types.ObjectId[];

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instance' }],
    default: [],
  })
  loadBalancers: mongoose.Schema.Types.ObjectId[];

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instance' }],
    default: [],
  })
  rdses: mongoose.Schema.Types.ObjectId[];

  @Prop({
    default: Date.now,
    type: Date,
    required: true,
  })
  createdAt: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
