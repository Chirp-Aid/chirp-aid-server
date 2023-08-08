import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { CreateOrphanageUserDto } from './dto/create-orphanage-user.dto';
import { OrphanageUsersService } from './orphanage-user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from 'src/commons/customValidationPipe.ts';

@ApiTags('MEMBERS: Users and OrphanageUsers')
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
    description:
      '사용자 회원가입 후 입력된 값을 확인하기 위해 다시 사용자 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: CreateUserDto,
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
      '보육원 계정 회원가입 후 입력된 값을 확인하기 위해 다시 보육원 계정 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: CreateOrphanageUserDto,
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
}
