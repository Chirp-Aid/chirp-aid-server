import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';

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
}
