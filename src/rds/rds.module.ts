import { Module } from '@nestjs/common';
import { RdsController } from './rds.controller';
import { RdsService } from './rds.service';

@Module({
  controllers: [RdsController],
  providers: [RdsService],
})
export class RdsModule {}
