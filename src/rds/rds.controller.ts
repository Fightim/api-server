import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CreateRdsDto, RdsResponseDto } from 'src/rds/dto';
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
  async getRdses(@Request() req: AuthorizedRequest): Promise<RdsResponseDto[]> {
    const userId = getUserId(req);
    const dbs = await this.rdsService.getRdses(userId);
    const responses: RdsResponseDto[] = [];
    for (const db of dbs) {
      responses.push(new RdsResponseDto(db));
    }
    return responses;
  }

  @Get('config')
  @GetRdsConfig()
  async getRdsConfig() {
    return this.rdsService.getRdsConfig();
  }

  @Get(':rdsId')
  @GetRdsDocs()
  async getRds(
    @Request() req: AuthorizedRequest,
    @Param('rdsId') rdsId: string,
  ) {
    const userId = getUserId(req);
    return new RdsResponseDto(await this.rdsService.getRds(userId, rdsId));
  }

  @Post()
  @CreateRdsDocs()
  async createRds(
    @Request() req: AuthorizedRequest,
    @Body() createRdsDto: CreateRdsDto,
  ): Promise<RdsResponseDto> {
    const userId = getUserId(req);
    return new RdsResponseDto(
      await this.rdsService.create(userId, createRdsDto),
    );
  }

  @Delete(':rdsId')
  @DeleteRdsDocs()
  async deleteRds() {
    return 'DELETE /rdses/:rdsId';
  }
}
