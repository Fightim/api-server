import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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

  async findOne(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new BadRequestException(
        '이메일에 해당하는 유저를 찾을 수 없습니다.',
      );
    }

    return user;
  }

  async updateKey(userId: string, accessKey: string, secret: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new BadRequestException('계정을 찾을 수 없습니다.');
    }

    user.accessKey = accessKey;
    user.secret = secret;
    user.save();

    return true;
  }
}
