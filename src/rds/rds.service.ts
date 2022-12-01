import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateRdsDto } from 'src/rds/dto';
import * as AWS from 'aws-sdk';
import { ReturnedUser, UsersService } from 'src/users/users.service';
import { updateAWSCredential } from 'src/aws/common';

@Injectable()
export class RdsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  getUserKey(user: ReturnedUser) {
    if (!user.accessKey || !user.secret) {
      throw new NotFoundException(
        '유저의 access key id, secret key가 저장되어 있지 않습니다.',
      );
    }
    return this.usersService.decodeKeys(user.accessKey, user.secret);
  }

  async create(userId: string, createRdsDto: CreateRdsDto) {
    const user = await this.usersService.findOneWithId(userId);
    if (!user) throw new NotFoundException('잘못된 유저 정보입니다.');

    const { decodedAccessKey, decodedSecret } = this.getUserKey(user);
    updateAWSCredential(decodedAccessKey, decodedSecret);

    const rds = new AWS.RDS({ apiVersion: '2014-10-31' });

    const params: AWS.RDS.CreateDBInstanceMessage = {
      DBName: 'testestest',
      AllocatedStorage: 10,
      DBInstanceIdentifier: createRdsDto.name,
      DBInstanceClass: 'db.t3.micro',
      Engine: 'mysql',
      MasterUsername: createRdsDto.masterUserName,
      MasterUserPassword: createRdsDto.rdsPassword,
    };

    const newDB = await rds.createDBInstance(params).promise();
    if (!newDB.DBInstance) {
      throw new InternalServerErrorException(
        'db instance 생성 중 에러가 발생했습니다.',
      );
    }

    const newDBInstance = newDB.DBInstance;
    console.log(newDBInstance);

    return newDBInstance;
  }

  async getRdsConfig() {
    return {
      host: this.configService.get<string>('RDS_HOST'),
      user: this.configService.get<string>('RDS_USER'),
      password: this.configService.get<string>('RDS_PASSWORD'),
    };
  }
}
