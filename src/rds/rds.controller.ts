import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateRdsDocs,
  DeleteRdsDocs,
  GetRdsConfig,
  GetRdsDocs,
  GetRdsesDocs,
} from 'src/rds/docs/swagger';
import { RdsService } from 'src/rds/rds.service';

@ApiTags('RDS')
@ApiBearerAuth()
@Controller('rds')
export class RdsController {
  constructor(private readonly rdsService: RdsService) {}

  @Get()
  @GetRdsesDocs()
  async getRdses() {
    return 'GET /rdses';
  }

  @Get('config')
  @GetRdsConfig()
  async getRdsConfig() {
    return this.rdsService.getRdsConfig();
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
}
