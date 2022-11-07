import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtConfigFactory = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
  }),
};
