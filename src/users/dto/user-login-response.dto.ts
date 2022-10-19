import { ApiProperty } from '@nestjs/swagger';

export class UserLoginResponseDto {
  @ApiProperty({
    description: 'JWT 토큰',
    required: true,
  })
  token: string;
}
