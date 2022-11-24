import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LoginResponseDto } from 'src/auth/dto';
import { CreateUserDto, RegisterUserKeyDto } from 'src/users/dto';
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
      type: LoginResponseDto,
    }),
  );
}

export function RegisterUserKeyDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'AWS Key 등록하기',
    }),
    ApiBearerAuth(),
    JwtHeader,
    ApiBody({
      type: RegisterUserKeyDto,
    }),
    ApiOkResponse({
      type: Boolean,
    }),
  );
}
