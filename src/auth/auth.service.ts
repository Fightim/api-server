import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto, LoginUserDto } from 'src/auth/dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findOne(email);

    if (!user || user.password != password) {
      throw new UnauthorizedException('잘못된 password 입니다.');
    }

    const payload = { user: user._id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '60m',
    });

    const res: LoginResponseDto = {
      token: accessToken,
    };

    return res;
  }
}
