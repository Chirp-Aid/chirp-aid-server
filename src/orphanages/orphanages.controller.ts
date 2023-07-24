import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from './dto/update-orphanage.dto';

@Controller('orphanages')
export class OrphanagesController {
  constructor(private readonly orphanagesService: OrphanagesService) {}

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.orphanagesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateOrphanageDto: UpdateOrphanageDto,
  // ) {
  //   return this.orphanagesService.update(+id, updateOrphanageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orphanagesService.remove(+id);
  // }
}
