import { ApiProperty } from '@nestjs/swagger';
import * as AWS from 'aws-sdk';
import { undefineToNull } from 'src/utils/helper';

export class RdsOptions {
  @ApiProperty({
    description: 'RDS 이름',
    required: true,
    type: String,
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    description: '마스터 사용자 이름',
    required: true,
    type: String,
    nullable: true,
  })
  masterUserName: string | null;
}

export class RdsInformations {
  @ApiProperty({
    description: '데이터베이스의 id',
    required: true,
    type: String,
    nullable: true,
  })
  id: string | null;

  @ApiProperty({
    description: '데이터베이스의 상태',
    required: true,
    type: String,
    nullable: true,
  })
  DBInstanceStatus: string | null;

  @ApiProperty({
    description: '엔드포인트',
    required: true,
    type: String,
    nullable: true,
  })
  endPoint: string | null;

  @ApiProperty({
    description: '포트',
    required: true,
    type: Number,
    nullable: true,
  })
  port: number | null;

  @ApiProperty({
    description: '스토리지',
    required: true,
    type: Number,
    nullable: true,
  })
  storage: number | null;
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

  constructor(dbInstance: AWS.RDS.DBInstance) {
    const options: RdsOptions = {
      name: undefineToNull(dbInstance.DBInstanceIdentifier),
      masterUserName: undefineToNull(dbInstance.MasterUsername),
    };

    const informations: RdsInformations = {
      id: undefineToNull(dbInstance.DBInstanceIdentifier),
      DBInstanceStatus: undefineToNull(dbInstance.DBInstanceStatus),
      endPoint: undefineToNull(dbInstance.Endpoint?.Address),
      port: undefineToNull(dbInstance.Endpoint?.Port),
      storage: undefineToNull(dbInstance.AllocatedStorage),
    };

    return { options: options, informations: informations };
  }
}
