import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInstanceDto } from 'src/instances/dto';
import * as AWS from 'aws-sdk';
import { updateAWSCredential } from 'src/aws/common';
import { createSecurityGroup } from 'src/aws/ec2';
import { ReturnedUser, UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  Instance,
  InstanceDocument,
} from 'src/instances/schemas/instance.schema';
import { Model, Schema } from 'mongoose';
import { PromiseResult } from 'aws-sdk/lib/request';
import { InstanceTier } from 'src/instances/dto/instance-response.dto';
import { getCreateInstanceInfo } from 'src/instances/utils/getCaseInfo';
import {
  defaultGetInstanceOptions,
  getInstanceOptions,
} from 'src/instances/utils/getInstanceOptions';
export type InstanceModel = Instance &
  Document &
  Required<{
    _id: Schema.Types.ObjectId;
  }>;

@Injectable()
export class InstancesService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Instance.name) private instanceModel: Model<InstanceDocument>,
  ) {}

  async getInstanceIds(user: ReturnedUser, prop: string) {
    const instanceList: InstanceModel[] = [];
    if (prop != 'backendInstances' && prop != 'frontendInstances') {
      throw new InternalServerErrorException('해당 속성을 가져올 수 없습니다.');
    }

    for (const id of user[prop]) {
      const instance = await this.instanceModel.findOne({ _id: id }).exec();
      if (!instance) {
        throw new InternalServerErrorException('Error가 발생했습니다.');
      }
      instanceList.push(instance);
    }

    return instanceList;
  }

  async fetchInstances(
    instanceIds: string[],
  ): Promise<AWS.EC2.InstanceList[] | null> {
    if (instanceIds.length == 0) {
      return [];
    }

    const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
    const params: AWS.EC2.DescribeInstancesRequest = {
      InstanceIds: instanceIds,
    };

    const info = await ec2.describeInstances(params).promise();

    if (!info.Reservations) {
      return null;
    }

    const instances: AWS.EC2.InstanceList[] = [];

    for (const reservations of info.Reservations) {
      if (reservations.Instances) {
        const instance = reservations.Instances;
        instances.push(instance);
      }
    }

    return instances;
  }

  async getInstances(
    userId: string,
    options: getInstanceOptions = defaultGetInstanceOptions,
  ) {
    const user = await this.usersService.findOneWithId(userId);
    if (!user) throw new NotFoundException('잘못된 유저 정보입니다.');

    const { decodedAccessKey, decodedSecret } =
      this.usersService.getUserKey(user);
    updateAWSCredential(decodedAccessKey, decodedSecret);

    const savedInstances: InstanceModel[] = [];

    if (options.frontend) {
      savedInstances.push(
        ...(await this.getInstanceIds(user, 'frontendInstances')),
      );
    }
    if (options.backend) {
      savedInstances.push(
        ...(await this.getInstanceIds(user, 'backendInstances')),
      );
    }

    const instanceIds = savedInstances.map((instance: InstanceModel) => {
      return instance.instanceId;
    });

    const fetchedInstances = await this.fetchInstances(instanceIds);
    if (!fetchedInstances) {
      return null;
    }
    return { savedInstances, fetchedInstances };

    // 1124 TODO DB에 정보 refresh 하기
  }

  async getInstance(userId: string, instanceId: string) {
    const user = await this.usersService.findOneWithId(userId);
    if (!user) throw new NotFoundException('잘못된 유저 정보입니다.');

    const { decodedAccessKey, decodedSecret } =
      this.usersService.getUserKey(user);
    updateAWSCredential(decodedAccessKey, decodedSecret);

    const savedInstance = await this.instanceModel
      .findOne({ instanceId: instanceId })
      .exec();
    if (!savedInstance) {
      throw new NotFoundException('해당 인스턴스를 찾을 수 없습니다.');
    }

    const fetchedInstances = await this.fetchInstances([
      savedInstance.instanceId,
    ]);
    if (!fetchedInstances) {
      return null;
    }
    const fetchedInstance = fetchedInstances[0][0];
    return { savedInstance, fetchedInstance };
  }

  async create(
    userId: string,
    createInstanceDtos: CreateInstanceDto[],
  ): Promise<PromiseResult<AWS.EC2.Reservation, AWS.AWSError>[]> {
    const user = await this.usersService.findOneWithId(userId);
    if (!user) throw new NotFoundException('잘못된 유저 정보입니다.');

    const { decodedAccessKey, decodedSecret } =
      this.usersService.getUserKey(user);
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
      const info = getCreateInstanceInfo(createInstanceDto);

      const instanceParams: AWS.EC2.RunInstancesRequest = {
        ImageId: info.imageId,
        InstanceType: 't2.micro',
        KeyName: 'cause-api-server-dev',
        MinCount: 1,
        MaxCount: 1,
        UserData: Buffer.from(info.userData).toString('base64'),
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

      await ec2.createTags(tagParams).promise();
      instanceInfos.push(instanceInfo);
      await this.saveInstance(
        user,
        createInstanceDto,
        instanceInfo.Instances[0],
      );
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
      githubUrl: createInstanceDto.githubUrl,
      publicIp: instanceInfo.PublicIpAddress || null,
      privateIp: instanceInfo.PrivateIpAddress,
      securityGroup: ['tcp : 80 - 0.0.0.0/0', 'tcp : 22 - 0.0.0.0/0'],
      type: createInstanceDto.type,
      os: createInstanceDto.os,
      tier: createInstanceDto.tier,
      etc: instanceInfo,
    });

    if (createdInstance.tier == InstanceTier.WEBSERVER) {
      user.frontendInstances.push(createdInstance._id);
    } else if (createdInstance.tier == InstanceTier.WAS) {
      user.backendInstances.push(createdInstance._id);
    }

    await user.save();
  }

  async delete(userId: string, instanceId: string) {
    const instance = await this.instanceModel
      .findOne({ instanceId: instanceId })
      .exec();
    if (!instance) {
      throw new NotFoundException('인스턴스를 찾을 수 없습니다.');
    }

    const user = await this.usersService.findOneWithId(userId);
    if (!user) throw new NotFoundException('잘못된 유저 정보입니다.');

    const { decodedAccessKey, decodedSecret } =
      this.usersService.getUserKey(user);
    updateAWSCredential(decodedAccessKey, decodedSecret);

    // 권한 검사. or user 정보 안에 해당 instanceId가 있는지 확인하기

    const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
    const params: AWS.EC2.TerminateInstancesRequest = {
      InstanceIds: [instanceId],
    };

    const info = await ec2.terminateInstances(params).promise();
    if (info.$response.error) {
      throw new InternalServerErrorException(
        '인스턴스를 종료하는데 에러가 발생했습니다.',
      );
    }

    const deleteResult = await this.instanceModel
      .deleteOne({ instanceId: instanceId })
      .exec();

    if (!deleteResult.acknowledged) {
      throw new InternalServerErrorException(
        '인스턴스를 DB에서 제거하는데 에러가 발생했습니다.',
      );
    }

    if (instance.tier == InstanceTier.WEBSERVER) {
      user.frontendInstances.splice(
        user.frontendInstances.indexOf(instance._id),
        1,
      );
    } else if (instance.tier == InstanceTier.WAS) {
      user.backendInstances.splice(
        user.backendInstances.indexOf(instance._id),
        1,
      );
    }

    user.save();
    return true;
  }
}
