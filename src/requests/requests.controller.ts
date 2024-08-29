import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
    description: 'Unaothorized',
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
  @ApiOperation({
    summary: '모든 물품 조회',
    description: '등록된 모든 물품들의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      example: [
        {
          product_id: 1,
          product_name: '초코파이',
          price: 3000,
          product_photo: '초코파이사진',
        },
        {
          product_id: 3,
          product_name: '쿠크다스',
          price: 1000,
          product_photo: '쿠크다스사진',
        },
      ],
    },
  })
  async getProducts() {
    return await this.requestsService.getProducts();
  }
}
