import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateRdsDocs,
  DeleteRdsDocs,
  GetRdsConfig,
  GetRdsDocs,
  GetRdsesDocs,
} from 'src/rds/docs/swagger';

@ApiTags('RDS')
@Controller('rds')
export class RdsController {
  @Get()
  @GetRdsesDocs()
  async getRdses() {
    return 'GET /rdses';
  }

  @Get(':rdsId')
  @GetRdsDocs()
  async getRds() {
    return 'GET /rdses/:rdsId';
  }

  @Post()
  @CreateRdsDocs()
  async createRds() {
    return 'POST /rdses';
  }

  @Delete(':rdsId')
  @DeleteRdsDocs()
  async deleteRds() {
    return 'DELETE /rdses/:rdsId';
  }

  @Get('config')
  @GetRdsConfig()
  async getRdsConfig() {
    return 'GET /rds/config';
  }
}
