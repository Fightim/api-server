import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { CreateRdsDto, RdsResponseDto } from 'src/rds/dto';

export function GetRdsesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'RDS 정보 전부 가져오기',
    }),
    ApiOkResponse({
      type: Array<RdsResponseDto>,
    }),
  );
}

export function GetRdsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '특정 RDS 정보 가져오기',
    }),
    ApiParam({
      name: 'rdsId',
      description: '가져올 RDS Id',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      type: RdsResponseDto,
    }),
  );
}

export function CreateRdsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'RDS 생성하기',
    }),
    ApiBody({
      type: CreateRdsDto,
    }),
    ApiOkResponse({
      type: RdsResponseDto,
    }),
  );
}

export function DeleteRdsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'RDS 삭제하기',
    }),
    ApiParam({
      name: 'rdsId',
      description: '삭제할 RDS의 Id',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      type: Boolean,
    }),
  );
}