import { ApiProperty } from '@nestjs/swagger';

export class LoadBalancerOptions {
  @ApiProperty({
    description: '로드밸런서 이름',
    required: true,
    type: String,
  })
  name: string;
}

export class LoadBalancerInformations {
  @ApiProperty({
    description: '로드밸런서의 Id',
    required: true,
    type: String,
  })
  id: string;

  @ApiProperty({
    description: '로드밸런서 도메인 주소',
    required: true,
    type: String,
  })
  domain: string;

  @ApiProperty({
    description: '로드밸런서 보안 그룹',
    required: true,
    type: [String],
  })
  securityGroup: [string];

  @ApiProperty({
    description: '로드밸런서 대상 그룹 인스턴스',
    required: true,
    type: [String],
  })
  targetGroupInstances: [string];
}

export class LoadBalancerResponseDto {
  @ApiProperty({
    description: '로드밸런서 옵션',
    required: true,
    type: LoadBalancerOptions,
  })
  options: LoadBalancerOptions;

  @ApiProperty({
    description: '로드밸런서 정보',
    required: true,
    type: LoadBalancerInformations,
  })
  informations: LoadBalancerInformations;
}
