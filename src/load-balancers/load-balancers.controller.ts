import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('load-balancers')
export class LoadBalancersController {
  @Get()
  async getLoadBalancers() {
    return 'GET /load-balancers';
  }

  @Get(':loadBalancerId')
  async getLoadBalancer() {
    return 'GET /load-balancers/:loadBalancerId';
  }

  @Post()
  async createLoadBalancer() {
    return 'POST /load-balancers';
  }

  @Delete(':loadBalancerId')
  async deleteLoadBalancer() {
    return 'DELETE /load-balancers/:loadBalancerId';
  }
}
