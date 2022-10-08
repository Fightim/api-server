import { CreateInstanceDto } from 'src/instances/dto/create-instance.dto';

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

export { CreateInstanceDto };
