import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
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
  GetInstancesBackendDocs,
  GetInstancesDocs,
} from 'src/instances/docs/swagger';
import { CreateInstanceDto } from 'src/instances/dto';
import { InstanceConnectionConfigResponseDto } from 'src/instances/dto/instance-connection-config-response.dto';
import { InstanceResponseDto } from 'src/instances/dto/instance-response.dto';
import { InstancesService } from 'src/instances/instances.service';
import { getInstanceResponseDtoFromInstances } from 'src/instances/utils/getInstances';
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
  async getInstances(@Request() req: AuthorizedRequest) {
    const userId = getUserId(req);

    const res = await this.instancesService.getInstances(userId);
    if (!res) {
      return [];
    }

    const { savedInstances, fetchedInstances } = res;

    return getInstanceResponseDtoFromInstances(
      savedInstances,
      fetchedInstances,
    );
  }

  @Get('backend')
  @GetInstancesBackendDocs()
  async getBackendInstance(
    @Request() req: AuthorizedRequest,
  ): Promise<InstanceConnectionConfigResponseDto> {
    const userId = getUserId(req);
    const res = await this.instancesService.getInstances(userId, {
      backend: true,
    });

    if (!res || res.fetchedInstances.length == 0) {
      return { publicIp: null };
    }

    const { savedInstances, fetchedInstances } = res;
    const instanceResponseDtos = await getInstanceResponseDtoFromInstances(
      savedInstances,
      fetchedInstances,
    );

    return { publicIp: instanceResponseDtos[0].informations.publicIp };
  }

  @Get(':instanceId')
  @GetInstanceDocs()
  async getInstance(
    @Request() req: AuthorizedRequest,
    @Param('instanceId') instanceId: string,
  ) {
    const userId = getUserId(req);

    const instance = await this.instancesService.getInstance(
      userId,
      instanceId,
    );

    if (!instance) {
      throw new NotFoundException('인스턴스 정보를 찾을 수 없습니다.');
    }

    const { savedInstance, fetchedInstance } = instance;
    return new InstanceResponseDto(savedInstance, fetchedInstance);
  }

  @Post()
  @CreateInstanceDocs()
  async create(
    @Request() req: AuthorizedRequest,
    @Body() createInstanceDtos: CreateInstanceDto[],
  ): Promise<InstanceResponseDto[]> {
    const responses: InstanceResponseDto[] = [];
    const userId = getUserId(req);

    if (!Array.isArray(createInstanceDtos)) {
      throw new BadRequestException(
        'createInstanceDto가 배열 형태가 아닙니다.', // #11.22 TODO : createInstanceDtos Guard로 Type Check 하기
      );
    }

    const instanceInfos = await this.instancesService.create(
      userId,
      createInstanceDtos,
    );

    for (let i = 0; i < createInstanceDtos.length; i++) {
      const instanceInfo = instanceInfos[i];
      const createInstanceDto = createInstanceDtos[i];

      if (!instanceInfo.Instances || !instanceInfo.Instances[0].InstanceId) {
        throw new InternalServerErrorException(
          '인스턴스 생성 후 정보를 가져오는데 에러가 발생했습니다.',
        );
      }

      const response = new InstanceResponseDto(
        createInstanceDto,
        instanceInfo.Instances[0],
      );

      responses.push(response);
    }

    return responses;
  }

  @Delete(':instanceId')
  @DeleteInstanceDocs()
  async delete(
    @Request() req: AuthorizedRequest,
    @Param('instanceId') instanceId: string,
  ): Promise<boolean> {
    const userId = getUserId(req);
    return await this.instancesService.delete(userId, instanceId);
  }
}
