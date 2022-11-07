import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDocs, RegisterUserKeyDocs } from 'src/users/docs/swagger';
import {
  CreateUserDto,
  RegisterUserKeyDto,
  UserResponseDto,
} from 'src/users/dto';
import { UserCreateDtoValidationPipe } from 'src/users/pipes/user-create-validate.pipe';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

function getUserResponseDto(user: User): UserResponseDto {
  return { email: user.email };
}

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('')
  @CreateUserDocs()
  async create(
    @Body(UserCreateDtoValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return getUserResponseDto(user);
  }

  @Post('key')
  @RegisterUserKeyDocs()
  async registerKey(
    @Body() registerUserKeyDto: RegisterUserKeyDto,
  ): Promise<boolean> {
    return true;
  }
}
