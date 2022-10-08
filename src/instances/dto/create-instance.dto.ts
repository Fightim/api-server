import { ApiProperty } from '@nestjs/swagger';

export enum InstanceType {
  T2MICRO = 't2.micro',
}

export enum InstanceOS {
  UBUNTU = 'UBUNTU',
  CENTOS = 'CENTOS',
}

export enum InstanceTier {
  WEBSERVER = 'WEBSERVER',
  WAS = 'WAS',
}

export class CreateInstanceDto {
  @ApiProperty({
    description: '인스턴스 유형',
    required: true,
    enum: InstanceType,
  })
  type: InstanceType;

  @ApiProperty({
    description: '인스턴스 OS 종류',
    required: true,
    enum: InstanceOS,
  })
  os: InstanceOS;

  @ApiProperty({
    description: '인스턴스의 서브넷 위치',
    required: true,
    enum: InstanceTier,
  })
  tier: InstanceTier;

  @ApiProperty({
    description: '인스턴스의 이름',
    required: true,
  })
  name: string;
}
