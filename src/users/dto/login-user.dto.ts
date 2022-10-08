import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: '로그인할 이메일',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: '로그인할 비밀번호',
    required: true,
  })
  password: string;
}
