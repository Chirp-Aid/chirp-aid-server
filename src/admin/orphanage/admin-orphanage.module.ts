import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerController } from './admin-orphanage.controller';
import { ManagerService } from './admin-orphanage.service';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Orphanage } from 'src/entities/orphanage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orphanage, OrphanageUser])],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
