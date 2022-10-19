import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateInstanceDto, InstanceResponseDto } from 'src/instances/dto';

export function GetInstancesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '인스턴스 정보 전부 가져오기',
    }),
    ApiOkResponse({
      type: [InstanceResponseDto],
    }),
  );
}

export function GetInstanceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '인스턴스 정보 전부 가져오기',
    }),
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
    }),
    ApiBody({
      type: CreateInstanceDto,
    }),
    ApiOkResponse({
      type: InstanceResponseDto,
    }),
  );
}

export function DeleteInstanceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '인스턴스 삭제하기',
    }),
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
