import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  InstanceOS,
  InstanceTier,
  InstanceType,
} from 'src/instances/dto/instance-response.dto';

export type InstanceDocument = Instance & Document;

@Schema()
export class Instance {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  instanceId: string;

  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  publicIp: string | null;

  @Prop({
    required: true,
    type: String,
  })
  privateIp: string;

  @Prop({
    required: true,
    type: Array<string>,
  })
  securityGroup: Array<string>;

  @Prop({
    required: true,
    type: String,
    enum: InstanceType,
  })
  type: InstanceType;

  @Prop({
    required: true,
    type: String,
    enum: InstanceOS,
  })
  os: InstanceOS;

  @Prop({
    required: true,
    type: String,
    enum: InstanceTier,
  })
  tier: InstanceTier;

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

export const InstanceSchema = SchemaFactory.createForClass(Instance);
