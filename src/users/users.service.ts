import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import * as CryptoJs from 'crypto-js';

export type ReturnedUser = Document<unknown, any, UserDocument> &
  User &
  Document;

@Injectable()
export class UsersService {
  aesSecret: string;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>('AES_SECRET');
    if (!secret) throw new Error('환경변수에 AES_SECRET이 없습니다.');
    this.aesSecret = secret;
  }

  async create(createUserDto: CreateUserDto): Promise<ReturnedUser> {
    const isExists = await this.userModel
      .findOne({
        email: createUserDto.email,
      })
      .exec();

    if (isExists) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }

    const createdUser = this.userModel.create(createUserDto);
    return createdUser;
  }

  async findOne(email: string): Promise<ReturnedUser> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new BadRequestException(
        '이메일에 해당하는 유저를 찾을 수 없습니다.',
      );
    }

    return user;
  }

  async findOneWithId(id: string): Promise<ReturnedUser> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new BadRequestException(
        '아이디에 해당하는 유저를 찾을 수 없습니다.',
      );
    }

    return user;
  }

  async updateKey(userId: string, accessKey: string, secret: string) {
    if (!this.configService.get<string>('AES_SECRET')) throw Error();
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) {
      throw new BadRequestException('계정을 찾을 수 없습니다.');
    }

    const { encodedAccessKey, encodedSecret } = await this.encodeKeys(
      accessKey,
      secret,
    );

    user.accessKey = encodedAccessKey;
    user.secret = encodedSecret;
    user.save();

    return true;
  }

  async encodeKeys(accessKey: string, secret: string) {
    const encodedAccessKey = CryptoJs.AES.encrypt(
      accessKey,
      this.aesSecret,
    ).toString();
    const encodedSecretKey = CryptoJs.AES.encrypt(
      secret,
      this.aesSecret,
    ).toString();
    return {
      encodedAccessKey: encodedAccessKey,
      encodedSecret: encodedSecretKey,
    };
  }

  decodeKeys(encodedAccessKey: string, encodedSecret: string) {
    const decodedAccessKey = CryptoJs.AES.decrypt(
      encodedAccessKey,
      this.aesSecret,
    ).toString(CryptoJs.enc.Utf8);
    const decodedSecret = CryptoJs.AES.decrypt(
      encodedSecret,
      this.aesSecret,
    ).toString(CryptoJs.enc.Utf8);
    return { decodedAccessKey: decodedAccessKey, decodedSecret: decodedSecret };
  }

  getUserKey(user: ReturnedUser) {
    if (!user.accessKey || !user.secret) {
      throw new NotFoundException(
        '유저의 access key id, secret key가 저장되어 있지 않습니다.',
      );
    }
    return this.decodeKeys(user.accessKey, user.secret);
  }
}
