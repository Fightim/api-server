import { ApiProperty } from '@nestjs/swagger';
import {
  InstanceOS,
  InstanceTier,
  InstanceType,
  StorageType,
} from 'src/instances/dto';

export class InstanceResponseDto {
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
    description: '인스턴스 이름',
    required: true,
    type: String,
  })
  name: string;

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
