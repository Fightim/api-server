import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto';
import { User, UserDocument } from 'src/users/users.schema';

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
}
