import { ApiProperty } from '@nestjs/swagger';

export class InstanceConnectionConfigResponseDto {
  @ApiProperty({
    description: '인스턴스 아이피',
    required: true,
    type: String,
    nullable: true,
  })
  publicIp: string | null;
}
