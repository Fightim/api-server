import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongodbFactory } from 'src/config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { InstancesModule } from './instances/instances.module';
import { LoadBalancersModule } from './load-balancers/load-balancers.module';
import { RdsModule } from './rds/rds.module';
import { AuthModule } from './auth/auth.module';
import { envValidationSchema } from 'src/config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envValidationSchema,
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongodbFactory),
    UsersModule,
    InstancesModule,
    LoadBalancersModule,
    RdsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
