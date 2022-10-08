import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateUserDocs,
  LoginUserDocs,
  RegisterUserKeyDocs,
} from 'src/users/docs/swagger';
import {
  CreateUserDto,
  LoginUserDto,
  RegisterUserKeyDto,
  UserResponseDto,
  UserLoginResponseDto,
} from 'src/users/dto';
import { UserCreateDtoValidationPipe } from 'src/users/pipes/user-create-validate.pipe';
import { UserLoginDtoValidationPipe } from 'src/users/pipes/user-login-validate.pipe';
import { User } from 'src/users/users.schema';
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

  @Post('login')
  @LoginUserDocs()
  async login(
    @Body(UserLoginDtoValidationPipe) loginUserDto: LoginUserDto,
  ): Promise<UserLoginResponseDto> {
    const mockToken: UserLoginResponseDto = { token: 'mock token' };
    return mockToken;
  }

  @Post('key')
  @RegisterUserKeyDocs()
  async registerKey(
    @Body() registerUserKeyDto: RegisterUserKeyDto,
  ): Promise<boolean> {
    return true;
  }
}
