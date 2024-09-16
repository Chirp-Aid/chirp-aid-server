import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('ADMIN: 관리자 기능')
@UseGuards(AuthGuard('access'), RolesGuard)
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: '사용자 정보 추가',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.adminUserService.createUser(createUserDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({
    summary: '등록된 사용자 정보 전체 조회',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 전체를 배열로 반환합니다.',
    schema: {
      type: 'object',
      example: [
        {
          name: '황용진',
          email: 'dswvgw1234@gmail.com',
          age: 5,
          sex: 'm',
          nickname: 'oko_jin',
          region: '뉴욕',
          phone_number: '01033288164',
          profile_photo: '사진 url',
          role: 'user',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findAllUser(): Promise<User[]> {
    return await this.adminUserService.findAllUser();
  }

  @Get('id')
  @Roles('admin')
  @ApiOperation({
    summary: '사용자 정보 id 검색',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보를 id기반으로 검색하여 하나의 객체를 반환합니다.',
    schema: {
      type: 'object',
      example: {
        name: '황용진',
        email: 'dswvgw1234@gmail.com',
        age: 5,
        sex: 'm',
        nickname: 'oko_jin',
        region: '뉴욕',
        phone_number: '01033288164',
        profile_photo: '사진 url',
        role: 'user',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'NotFound - 해당 유저를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findUserById(@Query('id') userId: string): Promise<User> {
    return await this.adminUserService.findUserById(userId);
  }

  @Get('nickname')
  @Roles('admin')
  @ApiOperation({
    summary: '사용자 정보 닉네임 검색',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보를 닉네임기반으로 검색하여 배열을 반환합니다.',
    schema: {
      type: 'object',
      example: [
        {
          name: '황용진',
          email: 'dswvgw1234@gmail.com',
          age: 5,
          sex: 'm',
          nickname: 'oko_jin',
          region: '뉴욕',
          phone_number: '01033288164',
          profile_photo: '사진 url',
          role: 'user',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findUserByNickname(
    @Query('nickname') nickname: string,
  ): Promise<User[]> {
    return await this.adminUserService.findUserByNickname(nickname);
  }

  @Patch('/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '사용자 정보 수정',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - 존재하는 닉네임입니다.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateUserById(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.adminUserService.updateUserById(userId, updateUserDto);
  }

  @Delete('/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '사용자 정보 삭제',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 404,
    description: 'NotFound - 해당 유저를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async deleteUserById(@Param('id') userId: string) {
    return await this.adminUserService.deleteUserById(userId);
  }
}
