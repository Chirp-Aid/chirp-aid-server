import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { AuthGuard } from '@nestjs/passport';
import { IOAuthUser } from 'src/auth/auth.userInterface';

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

  @UseGuards(AuthGuard('access'))
  @Post('/favorites')
  async createFavorite(@Body() createFavoriteDto: CreateFavoriteDto, @Request() req){
    const user_id = req.user.user_id;
    const orphanage_id = createFavoriteDto.orphanage_id;
    return await this.orphanagesService.createFavorite(orphanage_id, user_id);
  }
}
