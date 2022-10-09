import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateLoadBalancerDocs,
  DeleteLoadBalancerDocs,
  GetLoadBalancerDocs,
  GetLoadBalancersDocs,
} from 'src/load-balancers/docs/swagger';

@ApiTags('LoadBalancer')
@Controller('load-balancers')
export class LoadBalancersController {
  @Get()
  @GetLoadBalancersDocs()
  async getLoadBalancers() {
    return 'GET /load-balancers';
  }

  @Get(':loadBalancerId')
  @GetLoadBalancerDocs()
  async getLoadBalancer() {
    return 'GET /load-balancers/:loadBalancerId';
  }

  @Post()
  @CreateLoadBalancerDocs()
  async createLoadBalancer() {
    return 'POST /load-balancers';
  }

  @Delete(':loadBalancerId')
  @DeleteLoadBalancerDocs()
  async deleteLoadBalancer() {
    return 'DELETE /load-balancers/:loadBalancerId';
  }
}
