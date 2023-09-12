import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orphanage } from '../entities/orphanage.entity';
import { DataSource, Repository } from 'typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Favorites } from 'src/entities/favorites.entity';
import { User } from 'src/entities/user.entity';
import { Request } from 'src/entities/request.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Orphanage)
    private orphanageRepository: Repository<Orphanage>,
    @InjectRepository(OrphanageUser)
    private orphanageUserRepository: Repository<OrphanageUser>,
    @InjectRepository(Favorites) private favsRepository: Repository<Favorites>,
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    private dataSource: DataSource,
  ) {}

  async createFavorite(user_id, orphanage_id) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orphanage = await this.orphanageRepository.findOne({
        where: { orphanage_id: orphanage_id },
      });

      if (!orphanage) {
        throw new NotFoundException('해당 보육원을 찾을 수 없습니다.');
      }

      const user = await this.userRepository.findOne({
        where: { user_id: user_id },
      });

      // if (!user) {
      //   throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      // }

      const exist = await this.favsRepository
        .createQueryBuilder('favorites')
        .where('favorites.orphanage_id.orphanage_id = :orphanage_id', {
          orphanage_id,
        })
        .andWhere('favorites.user_id.user_id = :user_id', { user_id })
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
      console.log(error['response']);
      return error['response'];
    } finally {
      await queryRunner.release();
    }
  }

  async getFavorites(user_id) {
    try {
      const favorites = await this.favsRepository.find({
        where: { user_id: user_id },
        relations: ['orphanage_id'],
      });

      if (!favorites || favorites.length == 0) {
        return { orphanages: [] };
      }

      const orphanages = favorites.map((favorite) => ({
        orphanage_id: favorite.orphanage_id.orphanage_id,
        orphanage_name: favorite.orphanage_id.orphanage_name,
        address: favorite.orphanage_id.address,
        phone_number: favorite.orphanage_id.phone_number,
        photo: favorite.orphanage_id.photo,
      }));

      console.log(favorites);
      console.log(orphanages);

      return { orphanages };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
