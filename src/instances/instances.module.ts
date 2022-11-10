import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { InstancesController } from './instances.controller';
import { InstancesService } from './instances.service';

@Module({
  imports: [UsersModule],
  controllers: [InstancesController],
  providers: [InstancesService],
})
export class InstancesModule {}
