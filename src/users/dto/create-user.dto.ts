import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '회원가입할 이메일',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: '회원가입시 사용할 비밀번호',
    required: true,
  })
  password: string;

  @ApiProperty({
    description: '회원가입시 사용할 비밀번호 확인',
    required: true,
  })
  passwordCheck: string;
}
