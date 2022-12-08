import { InternalServerErrorException } from '@nestjs/common';
import {
  BACKEND_CENTOS_USER_DATA_SCRIPT,
  BACKEND_UBUNTU_USER_DATA_SCRIPT,
  CENTOS_IMAGE_ID,
  FRONTEND_CENTOS_USER_DATA_SCRIPT,
  FRONTEND_UBUNTU_USER_DATA_SCRIPT,
  getUserScript,
  NODE_CENTOS_IMAGE_ID,
  NODE_UBUNTU_IMAGE_ID,
  UBUNTU20_IMAGE_ID,
} from 'src/constants/instance';
import { CreateInstanceDto } from 'src/instances/dto';
import {
  InstanceOS,
  InstanceTier,
} from 'src/instances/dto/instance-response.dto';

export class CreateInstanceInfo {
  imageId: string;
  userData: string;
}

export function getCreateInstanceInfo(
  createInstanceDto: CreateInstanceDto,
): CreateInstanceInfo {
  if (
    createInstanceDto.githubUrl &&
    createInstanceDto.os == InstanceOS.CENTOS
  ) {
    return {
      imageId: NODE_CENTOS_IMAGE_ID,
      userData: getUserScript(createInstanceDto.githubUrl),
    };
  } else if (
    createInstanceDto.githubUrl &&
    createInstanceDto.os == InstanceOS.UBUNTU
  ) {
    return {
      imageId: NODE_UBUNTU_IMAGE_ID,
      userData: getUserScript(createInstanceDto.githubUrl),
    };
  } else if (
    createInstanceDto.os == InstanceOS.CENTOS &&
    createInstanceDto.tier == InstanceTier.WEBSERVER
  ) {
    return {
      imageId: CENTOS_IMAGE_ID,
      userData: FRONTEND_CENTOS_USER_DATA_SCRIPT,
    };
  } else if (
    createInstanceDto.os == InstanceOS.CENTOS &&
    createInstanceDto.tier == InstanceTier.WAS
  ) {
    return {
      imageId: CENTOS_IMAGE_ID,
      userData: BACKEND_CENTOS_USER_DATA_SCRIPT,
    };
  } else if (
    createInstanceDto.os == InstanceOS.UBUNTU &&
    createInstanceDto.tier == InstanceTier.WEBSERVER
  ) {
    return {
      imageId: UBUNTU20_IMAGE_ID,
      userData: FRONTEND_UBUNTU_USER_DATA_SCRIPT,
    };
  } else if (
    createInstanceDto.os == InstanceOS.UBUNTU &&
    createInstanceDto.tier == InstanceTier.WAS
  ) {
    return {
      imageId: UBUNTU20_IMAGE_ID,
      userData: BACKEND_UBUNTU_USER_DATA_SCRIPT,
    };
  }
  throw new InternalServerErrorException('기대되지 않는 값입니다.');
}
