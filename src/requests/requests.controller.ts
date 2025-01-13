import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { crawlingRequest } from './dto/crawling-request.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { deleteRequest } from './dto/delete-request.dto';

@ApiTags('REQUEST: 요청 글 관련 요청')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({
    summary: '보육원 요청 글 작성',
    description: '보육원의 요청 물품 요청글을 작성합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`orphanage's Access Token`}",
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
  @ApiResponse({
    status: 404,
    description:
      'Not Found - 해당 물품을 찾을 수 없습니다.\
    \nNot Found - 해당 사용자를 찾을 수 없습니다. (보육원 계정이 아닌 일반 사용자 계정으로 요청글을 올리는 시도할 경우)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - 이미 해당 요청이 존재합니다.',
  })
  @UseGuards(AuthGuard('access'))
  async createRequest(
    @Body() createRequestDto: CreateRequestDto,
    @Request() req,
  ) {
    const orphanageUserId = req.user.user_id;
    return await this.requestsService.createRequest(
      createRequestDto,
      orphanageUserId,
    );
  }

  @Get('products')
  @ApiOperation({ summary: '네이버 쇼핑 API를 사용하여 제품 검색' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: '검색할 제품명',
    example: '갤럭시 노트20',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`orphanage's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 제품 검색 결과를 반환합니다.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: '삼성전자 갤럭시 노트20 울트라 공기계',
          },
          price: {
            type: 'integer',
            example: 349070,
          },
          image: {
            type: 'string',
            example:
              'https://shopping-phinf.pstatic.net/main_4499267/44992671338.jpg',
          },
          link: {
            type: 'string',
            example:
              'https://www.lotte.com/p/product/L02235681986?sitmlNo=10000656sch_dtl_no=10000306entryPoint=pcs&dp_infw_cd=CHT',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async searchProduct(@Query('query') query: string) {
    return this.requestsService.searchProduct(query);
  }

  @Post('products/insert')
  @ApiOperation({ summary: '크롤링된 제품 정보를 저장' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: '삼성전자 갤럭시 노트20 울트라 5G 256GB (SKT)',
          description: '제품의 제목',
        },
        price: {
          type: 'integer',
          example: 221700,
          description: '제품의 가격',
        },
        image: {
          type: 'string',
          example:
            'https://shopping-phinf.pstatic.net/main_2371608/23716088492.20200807143243.jpg',
          description: '제품의 이미지 URL',
        },
        link: {
          type: 'string',
          example: 'https://search.shopping.naver.com/catalog/23716088492',
          description: '제품의 링크',
        },
      },
    },
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`orphanage's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 201,
    description: '성공적으로 제품 정보가 저장되었습니다.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async insertCrawlingProduct(@Body() crawlingRequest: crawlingRequest) {
    return this.requestsService.insertCrawlingProduct(crawlingRequest);
  }

  @Delete()
  @UseGuards(AuthGuard('access'))
  @ApiOperation({
    summary: '보육원의 요청 글 삭제',
    description: '보육원이 요청한 물품 요청 글을 삭제합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`orphanage's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 204,
    description: 'No Content - 요청 글이 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - 유효하지 않은 접근 토큰입니다.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found - 해당 사용자를 찾을 수 없습니다.\nNot Found - 삭제할 요청이 존재하지 않습니다.',
  })
  async deleteRequest(
    @Request() req,
    @Query('id') deleteRequest: deleteRequest,
  ) {
    const orphanageUserId = req.user.user_id;
    return await this.requestsService.deleteRequestByRequestId(
      orphanageUserId,
      deleteRequest,
    );
  }
}
