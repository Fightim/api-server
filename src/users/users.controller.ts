import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginResponseDto, LoginUserDto } from 'src/auth/dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDocs, RegisterUserKeyDocs } from 'src/users/docs/swagger';
import { CreateUserDto, RegisterUserKeyDto } from 'src/users/dto';
import { UserCreateDtoValidationPipe } from 'src/users/pipes/user-create-validate.pipe';
import { UsersService } from 'src/users/users.service';
import { getUserId } from 'src/users/utils';
import { AuthorizedRequest } from 'src/utils/types';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('')
  @CreateUserDocs()
  async create(
    @Body(UserCreateDtoValidationPipe) createUserDto: CreateUserDto,
  ): Promise<LoginResponseDto> {
    const user = await this.usersService.create(createUserDto);
    const loginUserDto: LoginUserDto = {
      email: user.email,
      password: user.password,
    };
    return this.authService.login(loginUserDto);
  }

  @Post('key')
  @UseGuards(JwtAuthGuard)
  @RegisterUserKeyDocs()
  async registerKey(
    @Request() req: AuthorizedRequest,
    @Body() registerUserKeyDto: RegisterUserKeyDto,
  ): Promise<boolean> {
    const userId = getUserId(req);

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
