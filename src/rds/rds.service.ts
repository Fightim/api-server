import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RdsService {
  constructor(private readonly configService: ConfigService) {}

  async getRdsConfig() {
    return {
      host: this.configService.get<string>('RDS_HOST'),
      user: this.configService.get<string>('RDS_USER'),
      password: this.configService.get<string>('RDS_PASSWORD'),
    };
  }
}
