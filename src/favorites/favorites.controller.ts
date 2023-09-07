import { Body, Controller, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from 'src/favorites/dto/create-favorite.dto';

@ApiTags('Favorites: 즐겨찾기 관련 요청')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({
    summary: '즐겨찾는 보육원 생성',
    description: '사용자의 즐겨찾기에 보육원을 추가합니다.',
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
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @UseGuards(AuthGuard('access'))
  async createFavorite(@Body() createFavoriteDto: CreateFavoriteDto, @Request() req): Promise<any> {
    const user_id = req.user.user_id;
    const orphanage_id = createFavoriteDto.orphanage_id
    return await this.favoritesService.createFavorite(user_id, orphanage_id);
  }

  @Get()
  @ApiOperation({
    summary: '즐겨찾는 보육원 목록 보기',
    description: '사용자의 즐겨찾기는 보육원을 반환합니다.',
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
  async getFavorites(@Request() req): Promise<any> {
    const user_id = req.user.user_id;
    return await this.favoritesService.getFavorites(user_id);
  }
}
