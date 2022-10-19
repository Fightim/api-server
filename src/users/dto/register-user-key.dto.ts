import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserKeyDto {
  @ApiProperty({
    description: 'AWS Access Key',
    required: true,
  })
  accessKey: string;

  @ApiProperty({
    description: 'AWS Secret',
    required: true,
  })
  secret: string;
}
