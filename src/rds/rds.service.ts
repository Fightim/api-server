import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRdsDto } from 'src/rds/dto';
import * as AWS from 'aws-sdk';
import { ReturnedUser, UsersService } from 'src/users/users.service';
import { updateAWSCredential } from 'src/aws/common';
import { RdsConnectionConfigResponseDto } from 'src/rds/dto/rds-connection-config-response.dto';
import { undefineToNull } from 'src/utils/helper';
import { InjectModel } from '@nestjs/mongoose';
import { Rds, RdsDocument } from 'src/rds/schemas/rds.schema';
import { Model } from 'mongoose';

@Injectable()
export class RdsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Rds.name) private rdsModel: Model<RdsDocument>,
  ) {}

  async saveRds(
    user: ReturnedUser,
    db: AWS.RDS.DBInstance,
    createRdsDto?: CreateRdsDto,
  ) {
    let savedDb = await this.rdsModel.findOne({
      id: db.DBInstanceIdentifier,
    });

    if (!savedDb) {
      if (!createRdsDto) {
        throw new InternalServerErrorException(
          'createRdsDto 없이는 rds document를 생성할 수 없습니다.',
        );
      }
      savedDb = new this.rdsModel({ password: createRdsDto.rdsPassword });
      user.rdses.push(savedDb._id);
    }

    savedDb.id = undefineToNull(db.DBInstanceIdentifier);
    savedDb.name = undefineToNull(db.DBInstanceIdentifier);
    savedDb.masterUserName = undefineToNull(db.MasterUsername);
    savedDb.DBInstanceStatus = undefineToNull(db.DBInstanceStatus);
    savedDb.endPoint = undefineToNull(db.Endpoint?.Address);
    savedDb.port = undefineToNull(db.Endpoint?.Port);
    savedDb.storage = undefineToNull(db.AllocatedStorage);

    await savedDb.save();
    await user.save();
    return savedDb;
  }

  async getRdses(userId: string): Promise<AWS.RDS.DBInstanceList> {
    const user = await this.usersService.findOneWithId(userId);
    if (!user) throw new NotFoundException('잘못된 유저 정보입니다.');

    const { decodedAccessKey, decodedSecret } =
      this.usersService.getUserKey(user);
    updateAWSCredential(decodedAccessKey, decodedSecret);

    const dbIds = [];
    for (const rds_id of user.rdses) {
      const db = await this.rdsModel.findOne({ _id: rds_id });
      dbIds.push(db?.id);
    }
    if (dbIds.length == 0) {
      return [];
    }

    const rds = new AWS.RDS({ apiVersion: '2014-10-31' });
    const dbs = await rds
      .describeDBInstances({
        Filters: [{ Name: 'db-instance-id', Values: dbIds }],
      })
      .promise();
    if (!dbs.DBInstances) {
      throw new InternalServerErrorException(
        'rds 정보를 가져오는데 문제가 생겼습니다.',
      );
    }

    for (const db of dbs.DBInstances) {
      await this.saveRds(user, db);
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

    this.saveRds(user, dbs.DBInstances[0]);
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
    await this.saveRds(user, newDBInstance, createRdsDto);
    return newDBInstance;
  }

  async getRdsConfig(userId: string): Promise<RdsConnectionConfigResponseDto> {
    const defaultConfig: RdsConnectionConfigResponseDto = {
      host: null,
      user: null,
      password: null,
    };

    const dbs = await this.getRdses(userId);
    if (dbs.length == 0) {
      return defaultConfig;
    } else {
      const db = await this.rdsModel.findOne({
        id: dbs[0].DBInstanceIdentifier,
      });
      if (!db) {
        return defaultConfig;
      }
      return {
        host: undefineToNull(dbs[0].Endpoint?.Address),
        user: undefineToNull(dbs[0].MasterUsername),
        password: db.password,
      };
    }
  }

  async delete(userId: string, rdsId: string): Promise<AWS.RDS.DBInstance> {
    const user = await this.usersService.findOneWithId(userId);
    if (!user) throw new NotFoundException('잘못된 유저 정보입니다.');

    const { decodedAccessKey, decodedSecret } =
      this.usersService.getUserKey(user);
    updateAWSCredential(decodedAccessKey, decodedSecret);

    const rds = new AWS.RDS({ apiVersion: '2014-10-31' });

    const params: AWS.RDS.DeleteDBInstanceMessage = {
      DBInstanceIdentifier: rdsId,
      DeleteAutomatedBackups: true,
      SkipFinalSnapshot: true,
    };
    const db = await rds.deleteDBInstance(params).promise();
    if (!db.DBInstance) {
      throw new InternalServerErrorException(
        'rds를 삭제하는데 문제가 생겼습니다.',
      );
    }

    const deletedDb = await this.rdsModel.findOne({
      id: db.DBInstance.DBInstanceIdentifier,
    });
    if (!deletedDb) {
      throw new InternalServerErrorException('지울 DB를 찾을 수 없습니다.');
    }

    await deletedDb.delete();
    user.rdses.splice(user.rdses.indexOf(deletedDb._id), 1);
    await user.save();

    return db.DBInstance;
  }
}
