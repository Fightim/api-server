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
import { SEOUL_REGION } from 'src/constants/common';
import { updateAWSCredential } from 'src/aws/common';

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
    if (!user) {
      throw new NotFoundException('잘못된 유저 정보입니다.');
    }

    if (!user.accessKey || !user.secret) {
      throw new NotFoundException(
        '유저의 access key id, secret key가 저장되어 있지 않습니다.',
      );
    }

    updateAWSCredential(user.accessKey, user.secret);

    const instanceParams = {
      ImageId: UBUNTU20_IMAGE_ID,
      InstanceType: 't2.micro',
      KeyName: 'cause-api-server-dev',
      MinCount: 1,
      MaxCount: 1,
      UserData: Buffer.from(FRONTEND_USER_DATA_SCRIPT).toString('base64'),
    };

    const newInstance = new AWS.EC2({ apiVersion: '2016-11-15' });
    let instanceInfo;

    try {
      instanceInfo = await newInstance.runInstances(instanceParams).promise();
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

    const instanceName = await newInstance.createTags(tagParams).promise();

    console.log(instanceName);
    console.log(instanceInfo);
    console.log(createInstanceDto);
  }
}
