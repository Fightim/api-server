import { ApiProperty } from '@nestjs/swagger';

export class RdsConnectionConfigResponseDto {
  @ApiProperty({
    description: 'RDS host',
    required: true,
    type: String,
    nullable: true,
  })
  host: string | null;

  @ApiProperty({
    description: 'RDS user',
    required: true,
    type: String,
    nullable: true,
  })
  user: string | null;

  @ApiProperty({
    description: 'RDS password',
    required: true,
    type: String,
    nullable: true,
  })
  password: string | null;
}
