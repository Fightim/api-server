import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const mongodbFactory = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<MongooseModuleFactoryOptions> => ({
    uri: configService.get('MONGODB_URI'),
  }),
  inject: [ConfigService],
};
