import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInstanceDto } from 'src/instances/dto';
import * as AWS from 'aws-sdk';
import {
  FRONTEND_USER_DATA_SCRIPT,
  UBUNTU20_IMAGE_ID,
} from 'src/constants/instance';
import { updateAWSCredential } from 'src/aws/common';
import { createSecurityGroup } from 'src/aws/ec2';
import { ReturnedUser, UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  Instance,
  InstanceDocument,
} from 'src/instances/schemas/instance.schema';
import { Model } from 'mongoose';
import { PromiseResult } from 'aws-sdk/lib/request';
import {
  InstanceTier,
  StorageType,
} from 'src/instances/dto/instance-response.dto';

@Injectable()
export class InstancesService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Instance.name) private instanceModel: Model<InstanceDocument>,
  ) {}

  async getInstances(userId: string) {
    const user = await this.usersService.findOneWithId(userId);

    if (!user) {
      throw new NotFoundException('잘못된 유저 정보입니다.');
    }

    if (!user.accessKey || !user.secret) {
      throw new NotFoundException(
        '유저의 access key id, secret key가 저장되어 있지 않습니다.',
      );
    }

    const { decodedAccessKey, decodedSecret } = this.usersService.decodeKeys(
      user.accessKey,
      user.secret,
    );

    updateAWSCredential(decodedAccessKey, decodedSecret);

    const instances: string[] = [];

    for (const id of user.frontendInstances) {
      const instance = await this.instanceModel.findOne({ _id: id }).exec();
      if (!instance) {
        throw new InternalServerErrorException('Error가 발생했습니다.');
      }
      instances.push(instance.instanceId);
    }

    console.log(instances);

    const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
    const params: AWS.EC2.DescribeInstancesRequest = {
      InstanceIds: instances,
    };

    const info = await ec2.describeInstances(params, function (error, data) {
      console.log(data);
    });
    return 'GET /instances';
  }

  async create(
    userId: string,
    createInstanceDtos: CreateInstanceDto[],
  ): Promise<PromiseResult<AWS.EC2.Reservation, AWS.AWSError>[]> {
    const user = await this.usersService.findOneWithId(userId);
    if (!user) {
      throw new NotFoundException('잘못된 유저 정보입니다.');
    }

    if (!user.accessKey || !user.secret) {
      throw new NotFoundException(
        '유저의 access key id, secret key가 저장되어 있지 않습니다.',
      );
    }

    const { decodedAccessKey, decodedSecret } = this.usersService.decodeKeys(
      user.accessKey,
      user.secret,
    );

    updateAWSCredential(decodedAccessKey, decodedSecret);

    const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
    const now = new Date();
    const securityGroupId = await createSecurityGroup(
      ec2,
      now.getTime() + '-webserver',
    );

    const instanceInfos: PromiseResult<AWS.EC2.Reservation, AWS.AWSError>[] =
      [];

    for (const createInstanceDto of createInstanceDtos) {
      const instanceParams: AWS.EC2.RunInstancesRequest = {
        ImageId: UBUNTU20_IMAGE_ID,
        InstanceType: 't2.micro',
        KeyName: 'cause-api-server-dev',
        MinCount: 1,
        MaxCount: 1,
        UserData: Buffer.from(FRONTEND_USER_DATA_SCRIPT).toString('base64'),
        SecurityGroupIds: [securityGroupId],
      };

      let instanceInfo: PromiseResult<AWS.EC2.Reservation, AWS.AWSError>;

      try {
        instanceInfo = await ec2.runInstances(instanceParams).promise();
      } catch (e) {
        console.error(e);
        throw new InternalServerErrorException(
          '인스턴스를 생성하는 도중에 문제가 발생했습니다',
        );
      }

      if (!instanceInfo.Instances) {
        throw new InternalServerErrorException(
          '제대로 인스턴스가 생성되지 않았습니다',
        );
      }

      if (!instanceInfo.Instances[0].InstanceId) {
        throw new InternalServerErrorException(
          '인스턴스 정보를 가져오지 못했습니다.',
        );
      }

      const instanceId = instanceInfo.Instances[0].InstanceId;
      const tagParams = {
        Resources: [instanceId],
        Tags: [
          {
            Key: 'Name',
            Value: createInstanceDto.name,
          },
        ],
      };

      const instanceName = await ec2.createTags(tagParams).promise();

      console.log(instanceName);
      console.log(instanceInfo);
      console.log(createInstanceDto);
      instanceInfos.push(instanceInfo);

      this.saveInstance(user, createInstanceDto, instanceInfo.Instances[0]);
    }

    return instanceInfos;
  }

  async saveInstance(
    user: ReturnedUser,
    createInstanceDto: CreateInstanceDto,
    instanceInfo: AWS.EC2.Instance,
  ) {
    const createdInstance = await this.instanceModel.create({
      instanceId: instanceInfo.InstanceId,
      name: createInstanceDto.name,
      publicIp: instanceInfo.PublicIpAddress || null,
      privateIp: instanceInfo.PrivateIpAddress,
      securityGroup: ['tcp : 80 - 0.0.0.0/0', 'tcp : 22 - 0.0.0.0/0'],
      type: createInstanceDto.type,
      os: createInstanceDto.os,
      tier: createInstanceDto.tier,
      storageType: StorageType.SSD,
      storageVolume: '8GB',
      etc: instanceInfo,
    });

    if (createdInstance.tier == InstanceTier.WEBSERVER) {
      user.frontendInstances.push(createdInstance._id);
    } else if (createdInstance.tier == InstanceTier.WAS) {
      user.backendInstances.push(createdInstance._id);
    }

    user.save();
  }
}
