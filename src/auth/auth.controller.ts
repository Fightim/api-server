import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginResponseDto } from 'src/auth/dto';
import { UserLoginDtoValidationPipe } from 'src/auth/pipes/user-login-validate.pipe';
import { LoginUserDocs } from 'src/auth/docs/swagger';
import { LoginUserDto } from 'src/auth/dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @LoginUserDocs()
  async login(
    @Body(UserLoginDtoValidationPipe) loginUserDto: LoginUserDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginUserDto);
  }
}
