import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rds, RdsSchema } from 'src/rds/schemas/rds.schema';
import { UsersModule } from 'src/users/users.module';
import { RdsController } from './rds.controller';
import { RdsService } from './rds.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Rds.name, schema: RdsSchema }]),
  ],
  controllers: [RdsController],
  providers: [RdsService],
})
export class RdsModule {}
