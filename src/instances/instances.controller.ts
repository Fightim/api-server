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
import {
  InstanceInformations,
  InstanceOption,
  InstanceResponseDto,
} from 'src/instances/dto/instance-response.dto';
import { InstancesService } from 'src/instances/instances.service';
import {
  getInstanceResponseDtoFromInstance,
  getInstanceResponseDtoFromInstances,
} from 'src/instances/utils/getInstances';
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
    return getInstanceResponseDtoFromInstance(savedInstance, fetchedInstance);
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

      const instanceOption: InstanceOption = {
        name: createInstanceDto.name,
      };

      const instanceInformations: InstanceInformations = {
        id: instanceInfo.Instances[0].InstanceId,
        type: createInstanceDto.type,
        os: createInstanceDto.os,
        tier: createInstanceDto.tier,
        publicIp: instanceInfo.Instances[0].PublicIpAddress || null,
        privateIp: instanceInfo.Instances[0].PrivateIpAddress || null,
        securityGroup: [
          'tcp : 80 - 0.0.0.0/0',
          'tcp : 22 - 0.0.0.0/0',
          'tcp : 443 - 0.0.0.0/0',
        ],
      };
      const response: InstanceResponseDto = {
        options: instanceOption,
        informations: instanceInformations,
      };

      responses.push(response);
    }

    return responses;
  }

  @Delete(':instanceId')
  @DeleteInstanceDocs()
  async delete() {
    return 'DELETE /instances/:instanceId';
  }

  @Get('backend')
  @GetInstancesBackendDocs()
  async getBackendInstance() {
    return 'GET /instances/backend';
  }
}
