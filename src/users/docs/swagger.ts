import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto, RegisterUserKeyDto } from 'src/users/dto';
import { UserLoginResponseDto } from 'src/users/dto/user-login-response.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { JwtHeader } from 'src/utils/swagger';

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

export function RegisterUserKeyDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'AWS Key 등록하기',
    }),
    JwtHeader,
    ApiBody({
      type: RegisterUserKeyDto,
    }),
    ApiOkResponse({
      type: Boolean,
    }),
  );
}
