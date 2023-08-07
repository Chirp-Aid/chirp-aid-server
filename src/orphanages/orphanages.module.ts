import { Module } from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';
import { OrphanagesController } from './orphanages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orphanage } from '../entities/orphanage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orphanage])],
  controllers: [OrphanagesController],
  providers: [OrphanagesService],
})
export class OrphanagesModule {}
