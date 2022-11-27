import { InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { InstanceResponseDto } from 'src/instances/dto';
import { InstanceModel } from 'src/instances/instances.service';

export const getNameFromTag = (
  tags: AWS.EC2.TagList | undefined,
): string | undefined => {
  if (!tags) {
    return undefined;
  }

  for (const tag of tags) {
    if (tag.Key == 'Name') {
      return tag.Value;
    }
  }
  return undefined;
};

export const getInstanceResponseDtoFromInstances = (
  savedInstances: InstanceModel[],
  fetchedInstances: AWS.EC2.InstanceList[],
): InstanceResponseDto[] => {
  const instanceResponseDtos: InstanceResponseDto[] = [];

  if (savedInstances.length != fetchedInstances.length) {
    throw new InternalServerErrorException(
      'DB에 저장된 instance 정보와 AWS 정보가 동기화되지 않았습니다. ',
    );
  }

  for (let i = 0; i < savedInstances.length; i++) {
    const savedInstance = savedInstances[i];
    const fetchedInstance = fetchedInstances[i][0];

    const response: InstanceResponseDto = new InstanceResponseDto(
      savedInstance,
      fetchedInstance,
    );
    instanceResponseDtos.push(response);
  }

  return instanceResponseDtos;
};
