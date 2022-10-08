import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto';
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
