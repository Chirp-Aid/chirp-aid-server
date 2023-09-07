import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('orphanages')
export class OrphanagesController {
  constructor(private readonly orphanagesService: OrphanagesService) {}

  @Get()
  async findAll() {
    return await this.orphanagesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.orphanagesService.findOne(id);
  }

  @Post('/favorites')
  async createFavorite(@Body() createFavoriteDto: CreateFavoriteDto){
    return await this.orphanagesService.createFavorite(createFavoriteDto);
  }
}
