import { BadRequestException, PipeTransform } from '@nestjs/common';
import { availableEmailRegex, availablePasswordRegex } from 'src/utils/policy';
import { CreateUserDto } from 'src/users/dto';

export class UserCreateDtoValidationPipe implements PipeTransform {
  readonly emailRegex = RegExp(availableEmailRegex);
  readonly passwordRegex = RegExp(availablePasswordRegex);

  isValidEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  isValidPasswordRegex(password: string): boolean {
    return this.passwordRegex.test(password);
  }

  isSamePassword(password: string, passwordCheck: string): boolean {
    console.log(password);
    console.log(passwordCheck);
    console.log(password === passwordCheck);
    return password === passwordCheck;
  }

  transform(value: CreateUserDto): CreateUserDto {
    console.log(value);
    if (value.email && !this.isValidEmail(value.email)) {
      throw new BadRequestException('이메일 형식에 맞지 않습니다.');
    }

    if (
      value.password &&
      !this.isValidPasswordRegex(value.password) &&
      value.passwordCheck &&
      !this.isValidPasswordRegex(value.passwordCheck)
    ) {
      throw new BadRequestException('패스워드가 올바르지 않습니다.');
    }

    if (!this.isSamePassword(value.password, value.passwordCheck)) {
      throw new BadRequestException('패스워드가 일치하지 않습니다.');
    }

    return value;
  }
}
