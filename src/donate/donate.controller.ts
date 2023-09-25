import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { DonateService } from './donate.service';
import { AddBasektDto } from './dto/add-basket.dto';
import { BasketService } from './basket.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DonateDto } from './dto/donate.dto';

@ApiTags('DONATE: 기부 관련 요청')
@Controller('donate')
export class DonateController {
  constructor(
    private readonly basketService: BasketService,
    private readonly donateService: DonateService
    ) {}

  @Post('basket')
  @ApiOperation({
    summary: '장바구니 추가',
    description:
      '보육원의 요청 물품을 사용자의 장바구니에 추가합니다.',
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
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 요청을 찾을 수 없습니다.\
    \nNot Found - 해당 사용자를 찾을 수 없습니다. (사용자 계정이 아닌 보육원 계정인 경우)',
  })
  @ApiResponse({
    status: 409,
    description: '해당 물품은 이미 장바구니에 있습니다.',
  })
  @UseGuards(AuthGuard('access'))
  async addBasekt(@Body() addBasektDto: AddBasektDto, @Request() req)
  {
    const userId = req.user.user_id;
    return await this.basketService.addBasket(userId, addBasektDto);
  }

  @Get('basket')
  @ApiOperation({
    summary: '장바구니 조회',
    description:
      '사용자의 장바구니를 조회합니다.',
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
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 사용자를 찾을 수 없습니다. (사용자 계정이 아닌 보육원 계정인 경우)',
  })
  @UseGuards(AuthGuard('access'))
  async getBaskets(@Request() req)
  {
    const userId = req.user.user_id;
    return await this.basketService.getBasket(userId);
  }

  @Post()
  @UseGuards(AuthGuard('access'))
  async donate(@Body() donateDto: DonateDto, @Request() req){
    const userId = req.user.user_id;
    return await this.donateService.donate(donateDto, userId);
  }
}
