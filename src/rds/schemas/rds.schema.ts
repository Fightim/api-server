import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type RdsDocument = Rds & Document;

@Schema()
export class Rds {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  id: string | null;

  @Prop({
    required: true,
    type: String,
  })
  name: string | null;

  @Prop({
    required: true,
    type: String,
  })
  masterUserName: string | null;

  @Prop({
    required: true,
    type: String,
  })
  password: string | null;

  @Prop({
    required: true,
    type: String,
    default: null,
  })
  DBInstanceStatus: string | null;

  @Prop({
    required: false,
    type: String,
    default: null,
  })
  endPoint: string | null;

  @Prop({
    required: false,
    type: String,
    default: null,
  })
  port: number | null;

  @Prop({
    required: true,
    type: Number,
  })
  storage: number | null;

  @Prop({
    required: true,
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
  })
  etc: any;
}

export const RdsSchema = SchemaFactory.createForClass(Rds);
