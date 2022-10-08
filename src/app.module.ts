import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongodbFactory } from 'src/config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { InstancesModule } from './instances/instances.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync(mongodbFactory),
    UsersModule,
    InstancesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
