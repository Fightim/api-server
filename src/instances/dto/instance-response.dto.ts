import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { CreateInstanceDto } from 'src/instances/dto/create-instance.dto';
import { InstanceModel } from 'src/instances/instances.service';

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

export class InstanceOption {
  @ApiProperty({
    description: '인스턴스 이름',
    required: true,
    type: String,
  })
  name: string;

  @ApiProperty({
    description: '연동된 github Url',
    required: true,
    type: String,
  })
  githubUrl: string;
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
    nullable: true,
  })
  publicIp: string | null;

  @ApiProperty({
    description: '인스턴스의 프라이빗 IP',
    required: true,
    type: String,
    nullable: true,
  })
  privateIp: string | null;

  @ApiProperty({
    description: '인스턴스의 보안그룹',
    required: true,
    type: [String],
  })
  securityGroup: string[];
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

  constructor(
    savedInstance: InstanceModel | CreateInstanceDto,
    fetchedInstance: AWS.EC2.Instance,
  ) {
    const instanceOption: InstanceOption = {
      name: savedInstance.name,
      githubUrl: savedInstance.githubUrl,
    };

    if (!fetchedInstance.InstanceId) {
      throw new InternalServerErrorException(
        'InstanceResponseDto를 작성할 때 instanceId를 찾을 수 없습니다.',
      );
    }

    const instanceInformations: InstanceInformations = {
      id: fetchedInstance.InstanceId,
      type: savedInstance.type,
      os: savedInstance.os,
      tier: savedInstance.tier,
      publicIp: fetchedInstance.PublicIpAddress || null,
      privateIp: fetchedInstance.PrivateIpAddress || null,
      securityGroup: [
        'tcp : 80 - 0.0.0.0/0',
        'tcp : 22 - 0.0.0.0/0',
        'tcp : 443 - 0.0.0.0/0',
      ],
    };
    const response: InstanceResponseDto = {
      options: instanceOption,
      informations: instanceInformations,
    };

    return response;
  }
}
