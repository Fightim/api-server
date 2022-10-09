import { Controller, Delete, Post } from '@nestjs/common';

@Controller('instances')
export class InstancesController {
  @Post()
  async create() {
    return 'POST /instances';
  }

  @Delete(':instanceId')
  async delete() {
    return 'DELETE /instances/:instanceId';
  }
}
