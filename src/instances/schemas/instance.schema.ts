import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type InstanceDocument = Instance & Document;

@Schema()
export class Instance {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  publicIp: string;

  @Prop({
    required: true,
    type: String,
  })
  privateIp: string;

  @Prop({
    required: true,
    type: Array<string>,
  })
  securityGroup: string;

  @Prop({
    required: true,
    type: String,
  })
  type: string;

  @Prop({
    required: true,
    type: String,
  })
  os: string;

  @Prop({
    required: true,
    type: String,
  })
  storageVolume: string;

  @Prop({
    required: true,
    type: String,
  })
  storageType: string;
}

export const InstanceSchema = SchemaFactory.createForClass(Instance);
