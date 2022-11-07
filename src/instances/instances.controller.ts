import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateInstanceDocs,
  DeleteInstanceDocs,
  GetInstanceDocs,
  GetInstancesDocs,
} from 'src/instances/docs/swagger';
import { CreateInstanceDto } from 'src/instances/dto';
import { InstancesService } from 'src/instances/instances.service';

@ApiTags('Instance')
@Controller('instances')
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}
  @Get()
  @GetInstancesDocs()
  async getInstances() {
    return 'GET /instances';
  }

  @Get(':instanceId')
  @GetInstanceDocs()
  async getInstance() {
    return 'GET /instances/:instanceId';
  }

  @Post()
  @CreateInstanceDocs()
  async create(
    @Request() req: Express.Request & { user: string },
    @Body() createInstanceDto: CreateInstanceDto,
  ) {
    const user = req.user;

    return this.instancesService.create(user, createInstanceDto);
  }

  @Delete(':instanceId')
  @DeleteInstanceDocs()
  async delete() {
    return 'DELETE /instances/:instanceId';
  }
}
