import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Instance,
  InstanceSchema,
} from 'src/instances/schemas/instance.schema';
import { UsersModule } from 'src/users/users.module';
import { InstancesController } from './instances.controller';
import { InstancesService } from './instances.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Instance.name, schema: InstanceSchema },
    ]),
  ],
  controllers: [InstancesController],
  providers: [InstancesService],
})
export class InstancesModule {}
