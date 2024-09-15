import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { orphanageManagerService } from './admin-orphanage.service';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Orphanage } from 'src/entities/orphanage.entity';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from 'src/orphanages/dto/updateOrphanage.dto';

@UseGuards(AuthGuard('access'), RolesGuard)
@Controller('admin/orphanage')
export class orphanageManagerController {
  constructor(private readonly managerService: orphanageManagerService) {}
  @Post()
  @Roles('admin')
  async createOrphanage(@Body() createOrphanageDto: CreateOrphanageDto) {
    return await this.managerService.createOrphanage(createOrphanageDto);
  }

  @Get()
  @Roles('admin')
  async getAllOrphanage(): Promise<Orphanage[]> {
    return await this.managerService.findAllOrphanage();
  }
  @Get(':id')
  @Roles('admin')
  async getOneOrphanage(@Param('id') orphanageId: number): Promise<Orphanage> {
    return await this.managerService.findOrphanageById(orphanageId);
  }

  @Patch('/:id')
  @Roles('admin')
  async updateOrphanage(
    @Param('id') orphanageId: number,
    @Body() updateOrphanageDto: UpdateOrphanageDto,
  ) {
    return await this.managerService.updateOrphanageById(
      orphanageId,
      updateOrphanageDto,
    );
  }

  @Delete('orphanage/:id')
  @Roles('admin')
  async deleteOrphanage(@Param('id') orphanageId: number): Promise<Orphanage> {
    return await this.managerService.deleteOrphanageById(orphanageId);
  }
}
