import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { CreateOrphanageUserDto } from './dto/create-orphanage-user.dto';
import { OrphanageUsersService } from './orphanage-user.service';
import { ApiHeader, ApiHeaders, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from 'src/commons/customValidationPipe';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateOrphanageUserDto } from './dto/update-orphanage-user.dto';

@ApiTags('MEMBERS: 회원가입, 사용자 정보 조회')
@Controller('members')
export class MembersController {
  private PASSWORD_SALT = 10;
  constructor(
    private readonly usersService: UsersService,
    private readonly orphanageUserService: OrphanageUsersService,
  ) {}

  @Post('/new/users')
  @ApiOperation({
    summary: '사용자 회원가입',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    // type: CreateUserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - 존재하는 이메일 또는 닉네임입니다.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Reqeust - \
    [password는 name과 같은 문자열을 포함할 수 없습니다.\
    \nBad Reqeust - 비밀번호는 8글자 이상으로 ^[A-Za-zd!@#$%^&*()]{8,30}가 포함되어야 합니다.',
  })
  async createUser(@Body(CustomValidationPipe) createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.PASSWORD_SALT,
    );
    const newUser = { ...createUserDto, password: hashedPassword };
    return await this.usersService.create(newUser);
  }

  @Post('/new/orphanages')
  @ApiOperation({
    summary: '보육원 계정 회원가입',
    description:
      '보육원 계정 회원가입 시, 보육원의 정보는 기존 데이터베이스에 존재해야 합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    // type: CreateOrphanageUserDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Reqeust - \
    [password는 name과 같은 문자열을 포함할 수 없습니다.\
      \nBad Reqeust - 비밀번호는 8글자 이상으로 ^[A-Za-zd!@#$%^&*()]{8,30}가 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 보육원을 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - 존재하는 이메일입니다.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Bad Reqeust - \
    [password는 name과 같은 문자열을 포함할 수 없습니다.\
    \nBad Reqeust - 비밀번호는 8글자 이상으로 ^[A-Za-zd!@#$%^&*()]{8,30}가 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - 이미 해당 보육원의 계정은 존재합니다.',
  })
  async createOrphanageUser(
    @Body(CustomValidationPipe) createOrphanageUserDto: CreateOrphanageUserDto,
  ) {
    const hashedPassword = await bcrypt.hash(
      createOrphanageUserDto.password,
      this.PASSWORD_SALT,
    );
    const newUser = { ...createOrphanageUserDto, password: hashedPassword };
    return await this.orphanageUserService.create(newUser);
  }

  @Patch('users/info')
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자 정보를 수정합니다. 이메일은 수정할 수 없습니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - 존재하는 닉네임입니다.',
  })
  @UseGuards(AuthGuard('access'))
  async updateUserInfo(
    @Body(CustomValidationPipe) updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const userId = req.user.user_id;
    const hashedPassword = await bcrypt.hash(
      updateUserDto.password,
      this.PASSWORD_SALT,
    );
    const updateDto = { ...updateUserDto, password: hashedPassword };
    return await this.usersService.updateUserInfo(userId, updateDto);
  }

  @Get('users/info')
  @ApiOperation({
    summary: '사용자 정보 조회',
    description:
      '사용자의 정보를 반환합니다. 이때 비밀번호, RT, FCM TOKEN은 제외합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보를 반환합니다.',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'user1' },
        email: { type: 'string', example: 'user@gmail.com' },
        age: { type: 'int', example: '23' },
        sex: { type: 'string', example: 'f' },
        nickname: { type: 'string', example: 'test' },
        region: { type: 'string', example: '구미' },
        phone_number: { type: 'string', example: 'user1' },
        profile_photo: { type: 'string', example: 'url' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 사용자를 찾을 수 없습니다.',
  })
  @UseGuards(AuthGuard('access'))
  async getUserInfo(@Request() req) {
    const userId = req.user.user_id;
    return await this.usersService.getUserInfo(userId);
  }

  @Patch('orphanages/info')
  @ApiOperation({
    summary: '보육원 계정 정보 수정',
    description: '보육원 계정 정보를 수정합니다. 이메일은 수정할 수 없습니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @UseGuards(AuthGuard('access'))
  async updateOrphanageUserInfo(
    @Body(CustomValidationPipe) updateUserDto: UpdateOrphanageUserDto,
    @Request() req,
  ) {
    const userId = req.user.user_id;
    const hashedPassword = await bcrypt.hash(
      updateUserDto.password,
      this.PASSWORD_SALT,
    );
    const updateDto = { ...updateUserDto, password: hashedPassword };
    return await this.orphanageUserService.updateUserInfo(userId, updateDto);
  }

  @Get('orphanages/info')
  @ApiOperation({
    summary: '보육원 계정 정보 조회',
    description:
      '보육원 계정의 정보를 반환합니다. 이때 비밀번호, RT, FCM TOKEN은 제외합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '보육원 계정의 정보를 반환합니다.',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@gmail.com' },
        name: { type: 'string', example: 'user1' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 사용자를 찾을 수 없습니다.',
  })
  @UseGuards(AuthGuard('access'))
  async getOrphanageUserInfo(@Request() req) {
    const userId = req.user.user_id;
    return await this.orphanageUserService.getUserInfo(userId);
  }
}
