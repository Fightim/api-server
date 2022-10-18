import { ApiProperty } from '@nestjs/swagger';

export class CreateRdsDto {
  @ApiProperty({
    description: 'RDS 이름',
    required: true,
    type: String,
  })
  name: string;

  @ApiProperty({
    description: '마스터 사용자 이름',
    required: true,
    type: String,
  })
  masterUserName: string;

  @ApiProperty({
    description: '비밀번호',
    required: true,
    type: String,
  })
  rdsPassword: string;

  @ApiProperty({
    description: '비밀번호 확인',
    required: true,
    type: String,
  })
  rdsPasswordCheck: string;
}
