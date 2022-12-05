import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateRdsDto } from 'src/rds/dto';
import * as AWS from 'aws-sdk';
import { UsersService } from 'src/users/users.service';
import { updateAWSCredential } from 'src/aws/common';

@Injectable()
export class RdsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async getRdses(userId: string): Promise<AWS.RDS.DBInstanceList> {
    const user = await this.usersService.findOneWithId(userId);
    if (!user) throw new NotFoundException('잘못된 유저 정보입니다.');

    const { decodedAccessKey, decodedSecret } =
      this.usersService.getUserKey(user);
    updateAWSCredential(decodedAccessKey, decodedSecret);

    const rds = new AWS.RDS({ apiVersion: '2014-10-31' });
    const dbs = await rds.describeDBInstances().promise();
    if (!dbs.DBInstances) {
      throw new InternalServerErrorException(
        'rds 정보를 가져오는데 문제가 생겼습니다.',
      );
    }

    return dbs.DBInstances;
  }

  async getRds(userId: string, rdsId: string): Promise<AWS.RDS.DBInstance> {
    const user = await this.usersService.findOneWithId(userId);
    if (!user) throw new NotFoundException('잘못된 유저 정보입니다.');

    const { decodedAccessKey, decodedSecret } =
      this.usersService.getUserKey(user);
    updateAWSCredential(decodedAccessKey, decodedSecret);

    const rds = new AWS.RDS({ apiVersion: '2014-10-31' });

    const params: AWS.RDS.DescribeDBInstancesMessage = {
      DBInstanceIdentifier: rdsId,
    };
    const dbs = await rds.describeDBInstances(params).promise();

    if (!dbs.DBInstances) {
      throw new InternalServerErrorException(
        'rds 정보를 가져오는데 문제가 생겼습니다.',
      );
    }

    return dbs.DBInstances[0];
  }

  async create(
    userId: string,
    createRdsDto: CreateRdsDto,
  ): Promise<AWS.RDS.DBInstance> {
    const user = await this.usersService.findOneWithId(userId);
    if (!user) throw new NotFoundException('잘못된 유저 정보입니다.');

    const { decodedAccessKey, decodedSecret } =
      this.usersService.getUserKey(user);
    updateAWSCredential(decodedAccessKey, decodedSecret);

    const rds = new AWS.RDS({ apiVersion: '2014-10-31' });

    const params: AWS.RDS.CreateDBInstanceMessage = {
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
