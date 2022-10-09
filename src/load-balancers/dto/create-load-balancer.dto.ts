import { ApiProperty } from '@nestjs/swagger';

export class CreateLoadBalancerDto {
  @ApiProperty({
    description: '로드밸런서 이름',
    required: true,
    type: String,
  })
  name: string;
}
