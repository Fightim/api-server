import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto';
import { UserCreateDtoValidationPipe } from 'src/users/pipes/user-create-validate.pipe';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('')
  async create(
    @Body(UserCreateDtoValidationPipe) createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }
}
