import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateInstanceDto, InstanceResponseDto } from 'src/instances/dto';
import { InstanceConnectionConfigResponseDto } from 'src/instances/dto/instance-connection-config-response.dto';
import { JwtHeader } from 'src/utils/swagger';

export function GetInstancesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '인스턴스 정보 전부 가져오기',
      deprecated: true,
    }),
    JwtHeader,
    ApiOkResponse({
      type: [InstanceResponseDto],
    }),
  );
}

export function GetInstanceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '인스턴스 정보 가져오기',
      deprecated: true,
    }),
    JwtHeader,
    ApiParam({
      name: 'instanceId',
      description: '가져올 instance Id',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      type: InstanceResponseDto,
    }),
  );
}

export function CreateInstanceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '인스턴스 생성하기',
      deprecated: true,
      description: `여러 인스턴스를 한번에 생성할 수 있습니다.   
        CreateInstanceDto의 배열을 전달해 여러 인스턴스를 생성할 수 있습니다.   
        하나의 인스턴스를 생성할 때에도 body의 배열의 형태로 전달해야합니다.`,
    }),
    JwtHeader,
    ApiBody({
      type: [CreateInstanceDto],
    }),
    ApiOkResponse({
      type: [InstanceResponseDto],
    }),
  );
}

export function DeleteInstanceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '인스턴스 삭제하기',
      deprecated: true,
    }),
    JwtHeader,
    ApiParam({
      name: 'instanceId',
      description: '삭제할 인스턴스의 Id',
      type: String,
    }),
    ApiOkResponse({
      type: Boolean,
    }),
  );
}

export function GetInstancesBackendDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '백엔드 인스턴스 정보 가져오기',
      deprecated: true,
    }),
    JwtHeader,
    ApiOkResponse({
      type: InstanceConnectionConfigResponseDto,
    }),
  );
}
