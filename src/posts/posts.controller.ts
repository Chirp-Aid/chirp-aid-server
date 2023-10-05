import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('POSTS: 인증글 관련 요청')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '인증글 작성',
    description:
      '보육원 계정으로 기부 받은 물품을 선택하여 인증글을 작성합니다.\
    \n인증글을 작성하기 전, 물품 태그를 가져온 후, 인증글 작성을 요청해주세요.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 사용자를 찾을 수 없습니다.',
  })
  @UseGuards(AuthGuard('access'))
  createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    const userId = req.user.user_id;
    return this.reviewService.createPost(createPostDto, userId);
  }

  @Get('/tags')
  @ApiOperation({
    summary: '물품 태그 요청',
    description:
      '해당 보육원이 기부 받은 물품명들을 반환합니다.\
    이때 인증글을 작성하지 않은 물품들만 반환합니다.\
    (인증글에 작성한 물품은 포함되지 않습니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema:{
      type: 'object',
      example: [{"product_name": "촉촉한 초코칩"},{"product_name": "초코파이"},]
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 사용자를 찾을 수 없습니다.',
  })
  @UseGuards(AuthGuard('access'))
  getTags(@Request() req) {
    const userId = req.user.user_id;
    return this.reviewService.getTags(userId);
  }

  @Get()
  @ApiOperation({
    summary: '모든 보육원 인증글 보기',
    description: '전제 보육원의 인증글을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      example: [
        {
          review_id: 3,
          title: 'title1',
          content: '우하하하 집 가고 싶다 우하하하하',
          photo: 'photostr',
          date: '2023-09-26 10:44:37',
          name: 'tue',
          orphanage_name: '보육원1',
          porudct_names: ['마가렛트', '초코파이'],
        },
        {
          review_id: 4,
          title: '보육원2',
          content: '해피추석~',
          photo: 'photostr',
          date: '2023-09-27 12:39:50',
          name: 'wed',
          orphanage_name: '보육원2',
          porudct_names: ['마가렛트'],
        },
      ],
    },
  })
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 보육원의 인증글 보기',
    description: '특정 보육원의 인증글만을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      example: [
        {
          review_id: 3,
          title: 'title1',
          content: '우하하하 집 가고 싶다 우하하하하',
          photo: 'photostr',
          date: '2023-09-26 10:44:37',
          porudct_names: ['마가렛트', '초코파이'],
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 보육원을 찾을 수 없습니다.',
  })
  getOnePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getOnePost(id);
  }
}
