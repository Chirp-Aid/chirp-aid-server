import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IOAuthUser } from 'src/auth/auth.userInterface';

@ApiTags('ORPHANAGES: 보육원 관련 요청')
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
        orphanage: {
          type: 'object',
          properties: {
            orphanage_id: { type: 'int', example: '1' },
            orphanage_name: { type: 'string', example: 'orphanage1' },
            address: { type: 'string', example: 'addr1' },
            phone_number: { type: 'string', example: '054-123-1234' },
            photo: { type: 'string', example: 'url' },
          },
        },
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
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 보육원을 찾지 못 했습니다.',
  })
  async findOne(@Param('id') id: number) {
    return await this.orphanagesService.findOne(id);
  }

  @Post('/favorites')
  @ApiOperation({
    summary: '즐겨찾는 보육원 가져오기',
    description: '사용자의 즐겨찾는 보육원을 반환합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      properties: {
        orphanages: {
          type: 'object',
          properties: {
            orphanage_id: { type: 'int', example: '1' },
            orphanage_name: { type: 'string', example: 'orphanage1' },
            address: { type: 'string', example: 'addr1' },
            phone_number: { type: 'string', example: '054-123-1234' },
            photo: { type: 'string', example: 'url' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @UseGuards(AuthGuard('access'))
  async createFavorite(@Body() orphanage_id: string, @Req() req: Request & IOAuthUser): Promise<any> {
    return await this.orphanagesService.createFavorite({user: req.user, orphanage_id});
  }
}
