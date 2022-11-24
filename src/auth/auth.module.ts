import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigFactory } from 'src/config/jwt.config';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync(jwtConfigFactory),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
