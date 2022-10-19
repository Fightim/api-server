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

export function GetLoadBalancersDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '로드밸런서 정보 전부 가져오기',
    }),
    ApiOkResponse({
      type: [LoadBalancerResponseDto],
    }),
  );
}

export function GetLoadBalancerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: '특정 로드밸런서 정보 가져오기',
    }),
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
    }),
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
    }),
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
