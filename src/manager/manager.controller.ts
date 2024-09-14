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
import { ManagerService } from './manager.service';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Orphanage } from 'src/entities/orphanage.entity';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from 'src/orphanages/dto/updateOrphanage.dto';

@UseGuards(AuthGuard('access'), RolesGuard)
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}
  @Post('orphanage')
  @Roles('admin')
  async createOrphanage(@Body() createOrphanageDto: CreateOrphanageDto) {
    return await this.managerService.createOrphanage(createOrphanageDto);
  }

  @Get('orphanage')
  @Roles('admin')
  async getAllOrphanage(): Promise<Orphanage[]> {
    return await this.managerService.findAllOrphanage();
  }
  @Get('orphanage/:id')
  @Roles('admin')
  async getOneOrphanage(@Param('id') orphanageId: number): Promise<Orphanage> {
    return await this.managerService.findOrphanageById(orphanageId);
  }

  @Patch('orphanage/:id')
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
