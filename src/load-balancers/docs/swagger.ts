import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import {
  CreateLoadBalancerDto,
  LoadBalancerResponseDto,
} from 'src/load-balancers/dto';
import { JwtHeader } from 'src/utils/swagger';

export function GetLoadBalancersDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '로드밸런서 정보 전부 가져오기',
      deprecated: true,
    }),
    JwtHeader,
    ApiOkResponse({
      type: [LoadBalancerResponseDto],
    }),
  );
}

export function GetLoadBalancerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '특정 로드밸런서 정보 가져오기',
      deprecated: true,
    }),
    JwtHeader,
    ApiParam({
      name: 'loadBalancerId',
      description: '가져올 로드밸런서 Id',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      type: LoadBalancerResponseDto,
    }),
  );
}

export function CreateLoadBalancerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '로드밸런서 생성하기',
      deprecated: true,
    }),
    JwtHeader,
    ApiBody({
      type: CreateLoadBalancerDto,
    }),
    ApiOkResponse({
      type: LoadBalancerResponseDto,
    }),
  );
}

export function DeleteLoadBalancerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '로드밸런서 삭제하기',
      deprecated: true,
    }),
    JwtHeader,
    ApiParam({
      name: 'loadBalancerId',
      description: '삭제할 로드밸런서의 Id',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      type: Boolean,
    }),
  );
}
