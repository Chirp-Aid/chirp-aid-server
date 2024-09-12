import { Controller, Get, UseGuards } from "@nestjs/common";
import { ManagerService } from "./manager.service";
import { RolesGuard } from "src/commons/guards/roles.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard('access'), RolesGuard)
@Controller('manager')
export class ManagerController{
    constructor(
        private readonly managerService:ManagerService,
      ) {}
    @Get('orphanage')
    @Roles('admin')
    async getAllOrphanage() {
        return await this.managerService.getAllOrphanage();
      }
}