import { Module } from '@nestjs/common';
import { LoadBalancersController } from './load-balancers.controller';
import { LoadBalancersService } from './load-balancers.service';

@Module({
  controllers: [LoadBalancersController],
  providers: [LoadBalancersService],
})
export class LoadBalancersModule {}
