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
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { AdminOrphanageUsersService } from './admin-orphanage-user.service';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { CreateOrphanageUserDto } from './dto/create-orphanage-user.dto';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { UpdateOrphanageUserDto } from './dto/update-orphanage-user.dto';

@Controller('admin/orphanage-users')
@ApiTags('ADMIN: 관리자 기능')
@UseGuards(AuthGuard('access'), RolesGuard)
export class AdminOrphanageUsersController {
  constructor(
    private readonly adminOrphanageUsersService: AdminOrphanageUsersService,
  ) {}

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: '보육원 사용자 정보 추가',
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
      'Bad Request - \
    [password는 name과 같은 문자열을 포함할 수 없습니다.\
    \nBad Request - 비밀번호는 8글자 이상으로 ^[A-Za-zd!@#$%^&*()]{8,30}가 포함되어야 합니다.',
  })
  async createOrphanageUser(
    @Body() createOrphanageUserDto: CreateOrphanageUserDto,
  ) {
    return await this.adminOrphanageUsersService.createOrphanageUser(
      createOrphanageUserDto,
    );
  }

  @Get()
  @Roles('admin')
  @ApiOperation({
    summary: '등록된 보육원 사용자 정보 전체 조회',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '보육원 사용자 정보 전체를 배열로 반환합니다.',
    schema: {
      type: 'object',
      example: [
        {
          name: '황용진',
          email: 'dswvgw1234@gmail.com',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findAllOrphanageUsers(): Promise<OrphanageUser[]> {
    return await this.adminOrphanageUsersService.findAllOrphanageUsers();
  }

  @Get('id')
  @Roles('admin')
  @ApiOperation({
    summary: '보육원 사용자 id 검색',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '보육원 사용자 정보를 id기반으로 검색합니다.',
    schema: {
      type: 'object',
      example: {
        name: '황용진',
        email: 'dswvgw1234@gmail.com',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findOrphanageUserById(
    @Query('id') orphanageUserId: string,
  ): Promise<OrphanageUser> {
    return await this.adminOrphanageUsersService.findOrphanageUserById(
      orphanageUserId,
    );
  }

  @Get('name')
  @Roles('admin')
  @ApiOperation({
    summary: '보육원 사용자 이름 검색',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description:
      '보육원 사용자 정보를 이름기반으로 검색하여 배열을 반환합니다.',
    schema: {
      type: 'object',
      example: [
        {
          name: '황용진',
          email: 'dswvgw1234@gmail.com',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findUserByName(@Query('name') name: string): Promise<OrphanageUser[]> {
    return await this.adminOrphanageUsersService.findOrphanageUserByName(name);
  }

  @Patch('/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '보육원 사용자 정보 수정',
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
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - 존재하는 이메일입니다.',
  })
  async updateOrphanageUserById(
    @Param('id') orphanageUserId: string,
    @Body() updateOrphanageUserDto: UpdateOrphanageUserDto,
  ) {
    return await this.adminOrphanageUsersService.updateOrphanageUserById(
      orphanageUserId,
      updateOrphanageUserDto,
    );
  }

  @Delete('/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '보육원 사용자 정보 삭제',
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
    status: 404,
    description: 'Not Found - 해당 보육원 사용자가 존재하지 않습니다.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async deleteOrphanageUserById(@Param('id') orphanageUserId: string) {
    return await this.adminOrphanageUsersService.deleteOrphanageUserById(
      orphanageUserId,
    );
  }
}
