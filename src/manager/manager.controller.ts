import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Orphanage } from 'src/entities/orphanage.entity';

@UseGuards(AuthGuard('access'), RolesGuard)
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}
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

  @Delete('orphanage/:id')
  @Roles('admin')
  async deleteOrphanage(@Param('id') orphanageId: number): Promise<Orphanage> {
    return await this.managerService.deleteOrphanageById(orphanageId);
  }
}
