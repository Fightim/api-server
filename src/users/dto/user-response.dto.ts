import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: '회원가입이 완료된 사용자의 이메일',
    required: true,
  })
  email: string;
}
