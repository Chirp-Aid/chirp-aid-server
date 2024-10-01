import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { orphanageManagerService } from './admin-orphanage.service';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Orphanage } from 'src/entities/orphanage.entity';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from 'src/orphanages/dto/updateOrphanage.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard('access'), RolesGuard)
@ApiTags('ADMIN: 관리자 보육원 관리')
@Controller('admin/orphanage')
@ApiTags('ADMIN: 관리자 기능')
export class orphanageManagerController {
  constructor(private readonly managerService: orphanageManagerService) {}

  @Post()
  @ApiOperation({ summary: '관리자가 보육원 생성' })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Roles('admin')
  @ApiOperation({
    summary: '관리자 보육원 생성',
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
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - 이미 존재하는 보육원입니다.',
  })
  async createOrphanage(@Body() createOrphanageDto: CreateOrphanageDto) {
    return await this.managerService.createOrphanage(createOrphanageDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({
    summary: '관리자 보육원 전체 조회',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '보육원 전체 정보를 반환합니다.',
    schema: {
      type: 'object',
      properties: {
        orphanage_id: { type: 'integer', example: 1 },
        orphanage_name: { type: 'string', example: '테스트에유' },
        address: { type: 'string', example: '경상북도 구미시 옥계북로 69' },
        homepage_link: { type: 'string', example: 'https://www.naver.com' },
        phone_number: { type: 'string', example: '010-1234-5678' },
        description: { type: 'string', example: '하이용' },
        photo: { type: 'string', example: 'path/to/photo.jpg' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  async getAllOrphanage(): Promise<Orphanage[]> {
    return await this.managerService.findAllOrphanage();
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({
    summary: '관리자 보육원 아이디 조회',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '특정 보육원을 반환합니다.',
    schema: {
      type: 'object',
      properties: {
        orphanage_id: { type: 'integer', example: 1 },
        orphanage_name: { type: 'string', example: '테스트에유' },
        address: { type: 'string', example: '경상북도 구미시 옥계북로 69' },
        homepage_link: { type: 'string', example: 'https://www.naver.com' },
        phone_number: { type: 'string', example: '010-1234-5678' },
        description: { type: 'string', example: '하이용' },
        photo: { type: 'string', example: 'path/to/photo.jpg' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당하는 보육원이 존재하지 않습니다.',
  })
  async getOneOrphanage(@Param('id') orphanageId: number): Promise<Orphanage> {
    return await this.managerService.findOrphanageById(orphanageId);
  }

  @Patch('/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '관리자 보육원 정보 수정',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'ok',
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당하는 보육원이 존재하지 않습니다.',
  })
  async updateOrphanage(
    @Param('id') orphanageId: number,
    @Body() updateOrphanageDto: UpdateOrphanageDto,
  ) {
    return await this.managerService.updateOrphanageById(
      orphanageId,
      updateOrphanageDto,
    );
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: '관리자 보육원 아이디를 통한 삭제',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '삭제된 보육원을을 반환합니다.',
    schema: {
      type: 'object',
      properties: {
        orphanage_id: { type: 'integer', example: 1 },
        orphanage_name: { type: 'string', example: '테스트에유' },
        address: { type: 'string', example: '경상북도 구미시 옥계북로 69' },
        homepage_link: { type: 'string', example: 'https://www.naver.com' },
        phone_number: { type: 'string', example: '010-1234-5678' },
        description: { type: 'string', example: '하이용' },
        photo: { type: 'string', example: 'path/to/photo.jpg' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당하는 보육원이 존재하지 않습니다.',
  })
  async deleteOrphanage(@Param('id') orphanageId: number): Promise<Orphanage> {
    return await this.managerService.deleteOrphanageById(orphanageId);
  }
}
