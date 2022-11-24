import * as AWS from 'aws-sdk';
import { InstanceResponseDto } from 'src/instances/dto';
import {
  InstanceInformations,
  InstanceOption,
  StorageType,
} from 'src/instances/dto/instance-response.dto';
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

export const getInstanceResponseDtoFromInstance = (
  savedInstance: InstanceModel,
  fetchedInstance: AWS.EC2.Instance,
) => {
  const instanceOption: InstanceOption = {
    name: savedInstance.name,
  };

  const instanceInformations: InstanceInformations = {
    id: savedInstance.instanceId,
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
    storageType: StorageType.SSD,
    storageVolume: '8GB',
  };
  const response: InstanceResponseDto = {
    options: instanceOption,
    informations: instanceInformations,
  };

  return response;
};

export const getInstanceResponseDtoFromInstances = (
  savedInstances: InstanceModel[],
  fetchedInstances: AWS.EC2.InstanceList[],
): InstanceResponseDto[] => {
  const instanceResponseDtos: InstanceResponseDto[] = [];

  for (let i = 0; i < savedInstances.length; i++) {
    const savedInstance = savedInstances[i];
    const fetchedInstance = fetchedInstances[i][0];

    const response: InstanceResponseDto = getInstanceResponseDtoFromInstance(
      savedInstance,
      fetchedInstance,
    );
    instanceResponseDtos.push(response);
  }

  return instanceResponseDtos;
};
