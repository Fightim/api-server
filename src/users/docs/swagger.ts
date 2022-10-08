import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from 'src/users/dto';
import { UserLoginResponseDto } from 'src/users/dto/user-login-response.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export function CreateUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'User 생성하기',
    }),
    ApiBody({
      type: CreateUserDto,
    }),
    ApiOkResponse({
      type: UserResponseDto,
    }),
  );
}

export function LoginUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '로그인 하기',
    }),
    ApiBody({
      type: LoginUserDto,
    }),
    ApiOkResponse({
      type: UserLoginResponseDto,
    }),
  );
}
