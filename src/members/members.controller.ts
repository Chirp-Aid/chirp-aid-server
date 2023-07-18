import { Controller, Post, Body,ValidationPipe, Res, UseGuards, Param, Get} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('/users')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const {email, password} = loginUserDto;
    return res.status(200).send(await this.usersService.login(email, password, res));
  }

  //테스트!! refreshToken 빼야함
  @UseGuards(AuthGuard('access'))
  @Get('/:id')
  async getUserInfo(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
}
