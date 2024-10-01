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
  async createOrphanage(@Body() createOrphanageDto: CreateOrphanageDto) {
    return await this.managerService.createOrphanage(createOrphanageDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({
    summary: '보육원 목록 가져오기',
    description:
      '모든 보육원의 정보를 반환합니다.\
      \n이때 보육원과 연결된 보육원 계정의 사용자(name)을 반환합니다. 보육원 계정과 연결되어 있지 않으면 `null`을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      example: [
        {
          orphanage_id: 1,
          orphanage_name: '보육원1',
          address: '주소1',
          phone_number: '111-1111',
          photo: '사진1',
          name: '보육원장1',
        },
        {
          orphanage_id: 2,
          orphanage_name: '보육원2',
          address: '주소2',
          phone_number: '222-2222',
          photo: '사진2',
          name: 'null',
        },
      ],
    },
  })
  async getAllOrphanage(): Promise<Orphanage[]> {
    return await this.managerService.findAllOrphanage();
  }
  @Get(':id')
  @Roles('admin')
  @ApiOperation({
    summary: '보육원 상세 정보 가져오기',
    description:
      '하나의 보육원의 상제 정보를 반환합니다. 보육원의 계정, 요청 목록도 함께 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      example: {
        name: '홍길동',
        orphanage_id: 1,
        orphanage_name: '금오보육원',
        address: '주소3',
        homepage_link: '링크3',
        phone_number: '333-3333',
        description: '설명3',
        photo: '사진3',
        requests: [
          {
            request_id: 6,
            product_name: '촉촉한 초코칩',
            price: 2000,
            count: 5,
            supported_count: 5,
            state: 'COMPLETED',
            message:
              '내가 좋아하는 촉촉한 초코칩, 내가 안 좋아는 안 촉촉한 초코칩',
            product_photo: '초코칩 사진',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 보육원을 찾지 못 했습니다.',
  })
  async getOneOrphanage(@Param('id') orphanageId: number): Promise<Orphanage> {
    return await this.managerService.findOrphanageById(orphanageId);
  }

  @Patch('/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '보육원 정보 수정',
    description: '`보육원 계정`으로 `보육원 정보`를 수정합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`Orphanage User's Access Token`}",
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
    status: 404,
    description: 'Not Found - 해당 보육원을 찾을 수 없습니다.',
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

  @Delete('orphanage/:id')
  @Roles('admin')
  async deleteOrphanage(@Param('id') orphanageId: number): Promise<Orphanage> {
    return await this.managerService.deleteOrphanageById(orphanageId);
  }
}
