import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DonateService } from './donate.service';
import { BasketService } from './basket.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DonateDto } from './dto/donate.dto';
import { AddBasektDto } from './dto/add-donate.dto';
import { DelBasketDto } from './dto/delete-basket.dto';

@ApiTags('DONATE: 기부 관련 요청')
@Controller('donate')
export class DonateController {
  constructor(
    private readonly basketService: BasketService,
    private readonly donateService: DonateService,
  ) {}

  @Post('basket')
  @ApiOperation({
    summary: '장바구니 추가',
    description: '보육원의 요청 물품을 사용자의 장바구니에 추가합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {`user\'s Access Token`}',
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
      'Not Found - 해당 요청을 찾을 수 없습니다.\
    \nNot Found - 해당 사용자를 찾을 수 없습니다. (사용자 계정이 아닌 보육원 계정인 경우)',
  })
  @ApiResponse({
    status: 400,
    description: '요청 수령보다 기부 수량이 많습니다.',
  })
  @UseGuards(AuthGuard('access'))
  async addBasekt(@Body() addBasektDto: AddBasektDto, @Request() req) {
    const userId = req.user.user_id;
    return await this.basketService.addBasket(userId, addBasektDto);
  }

  @Get('basket')
  @ApiOperation({
    summary: '장바구니 조회',
    description: '사용자의 장바구니를 조회합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {`user\'s Access Token`}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      example: [
        {
          request_id: 1,
          basket_product_id: 5,
          product_name: '초코파이',
          count: 10,
          price: 2000,
          orphanage_name: '보육원1',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found - 해당 사용자를 찾을 수 없습니다. (사용자 계정이 아닌 보육원 계정인 경우)',
  })
  @UseGuards(AuthGuard('access'))
  async getBaskets(@Request() req) {
    const userId = req.user.user_id;
    return await this.basketService.getBasket(userId);
  }

  @Patch('basket')
  @ApiOperation({
    summary: '장바구니 수량 변경',
    description: '사용자의 장바구니 물품 수량을 변경합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {`user\'s Access Token`}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found - 해당 요청을 찾을 수 없습니다.\
    \nNot Found - 해당 사용자를 찾을 수 없습니다. (사용자 계정이 아닌 보육원 계정인 경우)\
    \nNot Found - 해당 장바구니가 존재하지 않습니다.',
  })
  @UseGuards(AuthGuard('access'))
  async updateBasket(@Body() updateDto: AddBasektDto, @Request() req) {
    return await this.basketService.updateCount(req.user.user_id, updateDto);
  }

  @Delete('basket')
  @ApiOperation({
    summary: '장바구니 삭제',
    description: '특정 장바구니를 삭제합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {`user\'s Access Token`}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found - 해당 사용자를 찾을 수 없습니다. (사용자 계정이 아닌 보육원 계정인 경우)\
    \nNot Found - 해당 장바구니가 존재하지 않습니다.',
  })
  @UseGuards(AuthGuard('access'))
  async deleteBasket(@Body() deleteDto: DelBasketDto, @Request() req) {
    const userId = req.user.user_id;
    const BasketProductId = deleteDto.basket_product_id;
    return await this.basketService.deleteBasket(userId, BasketProductId);
  }

  @Post()
  @ApiOperation({
    summary: '기부하기',
    description: '특정 장바구니의 내용을 기부합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {`user\'s Access Token`}',
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
      'Not Found - 해당 사용자를 찾을 수 없습니다. (사용자 계정이 아닌 보육원 계정인 경우)\
    \nNot Found - {물품명}: 해당 요청을 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - {물품명}: 해당 요청은 기부가 완료되었습니다.\
    \nConflict - {물품명}: 해당 요청의 수량보다 기부 수량이 많습니다.',
  })
  @UseGuards(AuthGuard('access'))
  async donate(@Body() donateDto: DonateDto, @Request() req) {
    const userId = req.user.user_id;
    return await this.donateService.donate(donateDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: '기부 내역 조회하기',
    description:
      '기부 내역을 조회합니다.\
    \n!!보육원/사용자 모두 동일하게 요청하지만, 반환값은 다릅니다!!\
    \n `사용자(user)` : 사용자의 방문 신청 내역들을 조회합니다.\
      \n `보육원 계정(orphange)` : 보육원 계정의 방문 신청들을 조회합니다.',
  })
  @ApiQuery({
    name: 'account',
    required: true,
    description:
      '어느 계정인지 명시해줍니다. 일반 사용자은 `user`, 보육원 계정은 `orphanage`로 명시해주세요.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description:
      'OK\
    \n사용자(user) - 첫 번째 예시\
    \n보육원(orphanage) - 두 번째 예시',
    schema: {
      type: 'object',
      example: [
        {
          orphanage_name: '금오보육원',
          date: '2023-10-05 03:34:22',
          product_name: '촉촉한 초코칩',
          price: 2000,
          count: 5,
          message: '냠냠',
        },
        {
          user_nickname: '기부자 닉네임',
          date: '2023-10-05 03:46:59',
          product_name: '초코파이',
          price: 2000,
          count: 10,
          message: '끝~~~',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 사용자를 찾을 수 없습니다.',
  })
  @UseGuards(AuthGuard('access'))
  async getDonate(@Query('account') account: string, @Request() req) {
    const userId = req.user.user_id;
    if (account == 'user') {
      return await this.donateService.getUserDonate(userId);
    } else if (account == 'orphanage') {
      return await this.donateService.getOrphanDonate(userId);
    }
  }
}
