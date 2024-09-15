import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { Request } from 'src/entities/request.entity';
import { AdminBoardService } from './admin-board.service';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/commons/decorators/roles.decorator';

@Controller('admin/post')
@UseGuards(AuthGuard('access'), RolesGuard)
export class AdminBoardController {
  constructor(private readonly adminBoardService: AdminBoardService) {}
  @Get()
  @Roles('admin')
  async getAllRequest(): Promise<Request[]> {
    return await this.adminBoardService.findAllRequest();
  }

  @Get(':id')
  @Roles('admin')
  async getOneRequest(@Param('id') requestId: number): Promise<Request> {
    return await this.adminBoardService.findRequestById(requestId);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteRequest(@Param('id') requestId: number): Promise<void> {
    return await this.adminBoardService.deleteRequestById(requestId);
  }
}
