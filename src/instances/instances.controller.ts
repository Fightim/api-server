import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateInstanceDocs,
  DeleteInstanceDocs,
  GetInstanceDocs,
  GetInstancesDocs,
} from 'src/instances/docs/swagger';
import { CreateInstanceDto } from 'src/instances/dto';
import { InstancesService } from 'src/instances/instances.service';
import { getUserId } from 'src/users/utils';
import { AuthorizedRequest } from 'src/utils/types';

@ApiTags('Instance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
    @Request() req: AuthorizedRequest,
    @Body() createInstanceDto: CreateInstanceDto,
  ) {
    const userId = getUserId(req);
    return this.instancesService.create(userId, createInstanceDto);
  }

  @Delete(':instanceId')
  @DeleteInstanceDocs()
  async delete() {
    return 'DELETE /instances/:instanceId';
  }
}
