import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orphanage } from '../entities/orphanage.entity';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Favorites } from 'src/entities/favorites.entity';
import { User } from 'src/entities/user.entity';
import { Request } from 'src/entities/request.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Orphanage,
      OrphanageUser,
      Favorites,
      Request,
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
