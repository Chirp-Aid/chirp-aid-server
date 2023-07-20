import { Module } from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';
import { OrphanagesController } from './orphanages.controller';

@Module({
  controllers: [OrphanagesController],
  providers: [OrphanagesService]
})
export class OrphanagesModule {}
