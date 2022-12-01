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
  CreateRdsDocs,
  DeleteRdsDocs,
  GetRdsConfig,
  GetRdsDocs,
  GetRdsesDocs,
} from 'src/rds/docs/swagger';
import { CreateRdsDto } from 'src/rds/dto';
import { RdsService } from 'src/rds/rds.service';
import { getUserId } from 'src/users/utils';
import { AuthorizedRequest } from 'src/utils/types';

@ApiTags('RDS')
@UseGuards(JwtAuthGuard)
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
  async createRds(
    @Request() req: AuthorizedRequest,
    @Body() createRdsDto: CreateRdsDto,
  ) {
    const userId = getUserId(req);
    return this.rdsService.create(userId, createRdsDto);
  }

  @Delete(':rdsId')
  @DeleteRdsDocs()
  async deleteRds() {
    return 'DELETE /rdses/:rdsId';
  }
}
