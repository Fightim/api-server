import { ApiProperty } from '@nestjs/swagger';

export class RdsOptions {
  @ApiProperty({
    description: 'RDS 이름',
    required: true,
    type: String,
  })
  name?: string;

  @ApiProperty({
    description: '마스터 사용자 이름',
    required: true,
    type: String,
  })
  masterUserName?: string;
}

export class RdsInformations {
  @ApiProperty({
    description: '데이터베이스의 id',
    required: true,
    type: String,
  })
  id?: string;

  @ApiProperty({
    description: '데이터베이스의 상태',
    required: true,
    type: String,
  })
  DBInstanceStatus?: string;

  @ApiProperty({
    description: '엔드포인트',
    required: true,
    type: String,
  })
  endPoint?: string;

  @ApiProperty({
    description: '포트',
    required: true,
    type: Number,
  })
  port?: number;

  @ApiProperty({
    description: '스토리지',
    required: true,
    type: Number,
  })
  storage?: number;
}

export class RdsResponseDto {
  @ApiProperty({
    description: 'RDS 옵션',
    required: true,
    type: RdsOptions,
  })
  options: RdsOptions;

  @ApiProperty({
    description: 'RDS 정보',
    required: true,
    type: RdsInformations,
  })
  informations: RdsInformations;
}
