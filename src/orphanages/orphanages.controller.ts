import { Body, Controller, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';
import { CreateFavoriteDto } from '../favorites/dto/create-favorite.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IOAuthUser } from 'src/auth/auth.userInterface';

@ApiTags('ORPHANAGES: 보육원 정보 관련 요청')
@Controller('orphanages')
export class OrphanagesController {
  constructor(private readonly orphanagesService: OrphanagesService) {}

  @Get()
  @ApiOperation({
    summary: '보육원 목록 가져오기',
    description:
      '모든 보육원의 정보를 반환합니다. 이때 보육원 계정의 정보는 반환하지 않습니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
        properties: {
          orphanages: {type: 'object', example: [{
            orphanage_id: 1,
            orphanage_name: 'orphanage1',
            address: 'addr1',
            phone_number: '054-123-1234',
            photo: 'url',
          }]}
        },
    },
  })
  async findAll() {
    return await this.orphanagesService.findAll();
  }

  @Get(':id')
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
        properties: {
          name: { type: 'string', example: '보육원 계정주 이름' },
          orphanage_name: { type: 'string', example: 'orphanage1' },
          address: { type: 'string', example: 'addr1' },
          homepage_link: { type: 'string', example: 'homepage_link' },
          description: { type: 'string', example: '보육원 한줄 소개(설명)' },
          phone_number: { type: 'string', example: '054-123-1234' },
          photo: { type: 'string', example: 'url' },
          reqeusts: {type: 'object', example: [{
            request_id: 1,
            product_name: '초코파이',
            price: 10000,
            count: 40,
            supported_count: 0,
            message: '사주세요',
            product_photo: 'url'
          }]}
        },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 보육원을 찾지 못 했습니다.',
  })
  async findOne(@Param('id') id: number) {
    return await this.orphanagesService.findOne(id);
  }

  
}
