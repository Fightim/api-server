import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
