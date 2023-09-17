import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { DonateService } from './donate.service';
import { AddBasektDto } from './dto/add-basket.dto';
import { BasektService } from './basket.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('donate')
export class DonateController {
  constructor(
    private readonly basketService: BasektService
    ) {}

  @Post('basket')
  @UseGuards(AuthGuard('access'))
  async addBasekt(@Body() addBasektDto: AddBasektDto, @Request() req)
  {
    const userId = req.user.user_id;
    return await this.basketService.addBasket(userId, addBasektDto);
  }
}
