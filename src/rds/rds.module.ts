import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RdsController } from './rds.controller';
import { RdsService } from './rds.service';

@Module({
  imports: [UsersModule],
  controllers: [RdsController],
  providers: [RdsService],
})
export class RdsModule {}
