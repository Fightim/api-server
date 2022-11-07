import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginUserDto, LoginResponseDto } from 'src/auth/dto';

export function LoginUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '로그인 하기',
    }),
    ApiBody({
      type: LoginUserDto,
    }),
    ApiOkResponse({
      type: LoginResponseDto,
    }),
  );
}
