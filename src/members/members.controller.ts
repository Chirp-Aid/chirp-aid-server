import { Controller, Post, Body,ValidationPipe, } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';


@Controller('members')
export class MembersController {
  private PASSWORD_SALT = 10;
  constructor(private readonly usersService: UsersService) {}
  
  @Post('/new/users')
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.PASSWORD_SALT,
      );
    const newUser = {...createUserDto, password: hashedPassword}
    return await this.usersService.create(newUser);
  }

}
