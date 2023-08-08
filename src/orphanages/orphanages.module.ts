import { Module } from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';
import { OrphanagesController } from './orphanages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orphanage } from '../entities/orphanage.entity';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Favorites } from 'src/entities/favorites.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Orphanage, OrphanageUser, Favorites])],
  controllers: [OrphanagesController],
  providers: [OrphanagesService],
})
export class OrphanagesModule {}
