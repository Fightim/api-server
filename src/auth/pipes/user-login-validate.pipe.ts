import { PipeTransform } from '@nestjs/common';
import { LoginUserDto } from 'src/auth/dto';

export class UserLoginDtoValidationPipe implements PipeTransform {
  transform(value: LoginUserDto): LoginUserDto {
    value.email = value.email.trim();
    value.password = value.password.trim();
    return value;
  }
}
