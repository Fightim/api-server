import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AES } from 'crypto-js';
import * as CryptoJs from 'crypto-js';

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

  static async encodeKeys(
    cryptoKey: string,
    accessKey: string,
    secret: string,
  ) {
    const encodedAccessKey = AES.encrypt(accessKey, cryptoKey).toString();
    const encodedSecretKey = AES.encrypt(secret, cryptoKey).toString();
    return {
      encodedAccessKey: encodedAccessKey,
      encodedSecret: encodedSecretKey,
    };
  }

  static async decodeKeys(
    cryptoKey: string,
    encodedAccessKey: string,
    encodedSecret: string,
  ) {
    const decodedAccessKey = AES.decrypt(encodedAccessKey, cryptoKey).toString(
      CryptoJs.enc.Utf8,
    );
    const decodedSecret = AES.decrypt(encodedSecret, cryptoKey).toString(
      CryptoJs.enc.Utf8,
    );
    return { decodedAccessKey: decodedAccessKey, decodedSecret: decodedSecret };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
