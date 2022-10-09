import { Controller, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateInstanceDocs,
  DeleteInstanceDocs,
} from 'src/instances/docs/swagger';

@ApiTags('Instance')
@Controller('instances')
export class InstancesController {
  @Post()
  @CreateInstanceDocs()
  async create() {
    return 'POST /instances';
  }

  @Delete(':instanceId')
  @DeleteInstanceDocs()
  async delete() {
    return 'DELETE /instances/:instanceId';
  }
}
