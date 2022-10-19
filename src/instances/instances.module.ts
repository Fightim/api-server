import { Module } from '@nestjs/common';
import { InstancesController } from './instances.controller';
import { InstancesService } from './instances.service';

@Module({
  controllers: [InstancesController],
  providers: [InstancesService]
})
export class InstancesModule {}
