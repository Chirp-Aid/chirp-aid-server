import {
  Controller,
  Get,
} from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';

@Controller('orphanages')
export class OrphanagesController {
  constructor(private readonly orphanagesService: OrphanagesService) {}

  @Get()
  async findOne() {
    return await this.orphanagesService.findAll();
  }

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
