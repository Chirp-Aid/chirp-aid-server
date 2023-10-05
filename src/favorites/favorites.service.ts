import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orphanage } from '../entities/orphanage.entity';
import { DataSource, Repository } from 'typeorm';
import { Favorites } from 'src/entities/favorites.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Orphanage) private orphanageRepository: Repository<Orphanage>,
    @InjectRepository(Favorites) private favsRepository: Repository<Favorites>,
    private dataSource: DataSource,
  ) {}

  async createFavorite(userId, orphanageId) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orphanage = await this.orphanageRepository.findOne({
        where: { orphanage_id: orphanageId },
      });

      if (!orphanage) {
        throw new NotFoundException('해당 보육원을 찾을 수 없습니다.');
      }

      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const exist = await this.favsRepository
      .createQueryBuilder('favorites')
      .where('favorites.orphanage_id.orphanage_id = :orphanage_id',{ orphanage_id: orphanageId },)
      .andWhere('favorites.user_id.user_id = :user_id', {user_id: userId,})
      .getOne(); 

      if (exist) {
        throw new ConflictException('이미 해당 조합의 즐겨찾기가 존재합니다.');
      }

      const newFavorite = new Favorites();
      newFavorite.orphanage_id = orphanage;
      newFavorite.user_id = user;

      await this.favsRepository.save(newFavorite);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getFavorites(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const favorites = await this.favsRepository
      .createQueryBuilder('favorites')
      .select([
        'favorites.favorite_id as favorite_id',
        'o.orphanage_id as orphanage_id',
        'o.orphanage_name as orphanage_name',
        'o.address as address',
        'o.phone_number as phone_number',
        'o.photo as photo',
      ])
      .innerJoin('favorites.orphanage_id', 'o')
      .innerJoin('favorites.user_id', 'u')
      .where('u.user_id = :user_id', {user_id: userId})
      .getRawMany();

      if (!favorites || favorites.length == 0) {
        return { orphanages: [] };
      }

      return favorites;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delFavorite(favoriteId: number){
    const favorite = await this.favsRepository.findOne({
      where: { favorite_id: favoriteId },
    });

    if (!favorite) {
      throw new NotFoundException('해당 즐겨찾기가 존재하지 않습니다.');
    }
    await this.favsRepository.remove(favorite);
  }
}
