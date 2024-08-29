import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from 'src/favorites/dto/create-favorite.dto';
import { DelFavoriteDto } from './dto/delete-favorite.dto';

@ApiTags('Favorites: 즐겨찾기 관련 요청')
@UseGuards(AuthGuard('access'))
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
    description: "Bearer {`user's Access Token`}",
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
  @ApiResponse({
    status: 404,
    description:
      'Not Found - 해당 보육원을 찾을 수 없습니다.\
    \nNot Found - 해당 사용자를 찾을 수 없습니다. (보육원 계정이 아닌 일반 사용자 계정으로 요청글을 올리는 시도할 경우)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - 이미 해당 조합의 즐겨찾기가 존재합니다.',
  })
  async createFavorite(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @Request() req,
  ): Promise<any> {
    const userId = req.user.user_id;
    const orphanageId = createFavoriteDto.orphanage_id;
    return await this.favoritesService.createFavorite(userId, orphanageId);
  }

  @Get()
  @ApiOperation({
    summary: '즐겨찾는 보육원 목록 보기',
    description: '사용자의 즐겨찾기는 보육원을 반환합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      example: [
        {
          favorite_id: 1,
          orphanage_id: 3,
          orphanage_name: '금오보육원',
          address: '주소3',
          phone_number: '333-3333',
          photo: '사진3',
        },
        {
          favorite_id: 2,
          orphanage_id: 2,
          orphanage_name: '보육원2',
          address: '주소2',
          phone_number: '222-2222',
          photo: '사진2',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found - 해당 사용자를 찾을 수 없습니다. (보육원 계정이 아닌 일반 사용자 계정으로 요청글을 올리는 시도할 경우)',
  })
  async getFavorites(@Request() req): Promise<any> {
    const userId = req.user.user_id;
    return await this.favoritesService.getFavorites(userId);
  }

  @Delete()
  @ApiOperation({
    summary: '즐겨찾는 삭제',
    description: '해당 즐겨찾기를 삭제합니다.',
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
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 즐겨찾기를 찾을 수 없습니다.',
  })
  async delFavorite(@Body() delFavoriteDto: DelFavoriteDto) {
    return await this.favoritesService.delFavorite(delFavoriteDto.favorite_id);
  }
}
