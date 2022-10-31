import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInstanceDto } from 'src/instances/dto';
import * as AWS from 'aws-sdk';

class mockUserModel {
  findOne(userId: string) {
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secret = process.env.AWS_SECRET;

    return { id: 'mockUser', accessKey: accessKey, secret: secret };
  }
}

@Injectable()
export class InstancesService {
  userModel: mockUserModel;

  constructor() {
    this.userModel = new mockUserModel();
  }

  async create(userId: string, createInstanceDto: CreateInstanceDto) {
    const user = this.userModel.findOne(userId);

    if (!user.accessKey && !user.secret) {
      throw new NotFoundException(
        '유저의 access key id, secret key가 저장되어 있지 않습니다.',
      );
    }

    const credential = new AWS.Credentials({
      accessKeyId: user.accessKey ? user.accessKey : '',
      secretAccessKey: user.secret ? user.secret : '',
    });

    AWS.config.update({
      region: 'ap-northeast-2',
      credentials: credential,
    });

    const UBUNTU2004 = 'ami-07d16c043aa8e5153';
    // AMI is amzn-ami-2011.09.1.x86_64-ebs
    const instanceParams = {
      ImageId: UBUNTU2004,
      InstanceType: 't2.micro',
      KeyName: 'cause-api-server-dev',
      MinCount: 1,
      MaxCount: 1,
    };

    const newInstance = new AWS.EC2({ apiVersion: '2016-11-15' });
    const instanceInfo = await newInstance
      .runInstances(instanceParams)
      .promise();

    if (!instanceInfo.Instances) {
      return new InternalServerErrorException(
        '제대로 인스턴스가 생성되지 않았습니다',
      );
    }

    if (!instanceInfo.Instances[0].InstanceId) {
      return new InternalServerErrorException(
        '인스턴스 정보를 가져오지 못했습니다.',
      );
    }

    const instanceId = instanceInfo.Instances[0].InstanceId;

    const tagParams = {
      Resources: [instanceId],
      Tags: [
        {
          Key: 'Name',
          Value: 'Javascript SDK Sample',
        },
      ],
    };

    const instanceName = await newInstance.createTags(tagParams).promise();

    console.log(instanceName);
    console.log(instanceInfo);
    console.log(createInstanceDto);
  }
}
