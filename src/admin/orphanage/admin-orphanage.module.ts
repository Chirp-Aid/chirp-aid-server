import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { orphanageManagerController } from './admin-orphanage.controller';
import { orphanageManagerService } from './admin-orphanage.service';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Orphanage } from 'src/entities/orphanage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orphanage, OrphanageUser])],
  controllers: [orphanageManagerController],
  providers: [orphanageManagerService],
})
export class AdminOrphanageModule {}
