import { PipeTransform } from '@nestjs/common';
import { LoginUserDto } from 'src/users/dto';

export class UserLoginDtoValidationPipe implements PipeTransform {
  transform(value: LoginUserDto): LoginUserDto {
    // 추후 로직 작성
    return value;
  }
}
