import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDocs, RegisterUserKeyDocs } from 'src/users/docs/swagger';
import {
  CreateUserDto,
  RegisterUserKeyDto,
  UserResponseDto,
} from 'src/users/dto';
import { UserCreateDtoValidationPipe } from 'src/users/pipes/user-create-validate.pipe';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthorizedRequest } from 'src/utils/types';

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
  @UseGuards(JwtAuthGuard)
  @RegisterUserKeyDocs()
  async registerKey(
    @Request() req: AuthorizedRequest,
    @Body() registerUserKeyDto: RegisterUserKeyDto,
  ): Promise<boolean> {
    const { userId } = req.user;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.usersService.updateKey(
      userId,
      registerUserKeyDto.accessKey,
      registerUserKeyDto.secret,
    );
  }
}
