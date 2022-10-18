import { ApiProperty } from '@nestjs/swagger';

export class RdsResponseDto {
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
    name: '엔드포인트',
    required: true,
    type: String,
  })
  endPoint: string;

  @ApiProperty({
    name: '포트',
    required: true,
    type: Number,
  })
  port: number;

  @ApiProperty({
    name: '스토리지',
    required: true,
    type: String,
  })
  storage: string;
}
