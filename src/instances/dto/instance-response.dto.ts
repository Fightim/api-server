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

export enum StorageType {
  SSD = 'SSD',
  HDD = 'HDD',
}

export class InstanceOption {
  @ApiProperty({
    description: '인스턴스 이름',
    required: true,
    type: String,
  })
  name: string;
}

export class InstanceInformations {
  @ApiProperty({
    description: '인스턴스의 Id',
    required: true,
    type: String,
  })
  id: string;

  @ApiProperty({
    description: '인스턴스 유형',
    required: true,
    enum: InstanceType,
  })
  type: InstanceType;

  @ApiProperty({
    description: '인스턴스 OS',
    required: true,
    enum: InstanceOS,
  })
  os: InstanceOS;

  @ApiProperty({
    description: '인스턴스 서브넷 위치',
    required: true,
    enum: InstanceTier,
  })
  tier: InstanceTier;

  @ApiProperty({
    description: '인스턴스의 퍼블릭 IP',
    required: true,
    type: String,
  })
  publicIp: string;

  @ApiProperty({
    description: '인스턴스의 프라이빗 IP',
    required: true,
    type: String,
  })
  privateIp: string;

  @ApiProperty({
    description: '인스턴스의 보안그룹',
    required: true,
    type: [String],
  })
  securityGroup: [string];

  @ApiProperty({
    description: '인스턴스의 스토리지 크기',
    required: true,
    type: String,
  })
  storageVolume: string;

  @ApiProperty({
    description: '인스턴스의 스토리지 유형',
    required: true,
    enum: StorageType,
  })
  storageType: StorageType;
}

export class InstanceResponseDto {
  @ApiProperty({
    description: '인스턴스 옵션',
    required: true,
    type: InstanceOption,
  })
  options: InstanceOption;

  @ApiProperty({
    description: '인스턴스 정보',
    required: true,
    type: InstanceInformations,
  })
  informations: InstanceInformations;
}
