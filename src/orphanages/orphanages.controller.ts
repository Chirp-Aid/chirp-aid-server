import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from './dto/update-orphanage.dto';

@Controller('orphanages')
export class OrphanagesController {
  constructor(private readonly orphanagesService: OrphanagesService) {}

  @Post()
  create(@Body() createOrphanageDto: CreateOrphanageDto) {
    return this.orphanagesService.create(createOrphanageDto);
  }

  @Get()
  findAll() {
    return this.orphanagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orphanagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrphanageDto: UpdateOrphanageDto) {
    return this.orphanagesService.update(+id, updateOrphanageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orphanagesService.remove(+id);
  }
}
