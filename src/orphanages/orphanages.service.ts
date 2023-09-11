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
export class OrphanagesService {
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

  async findAll() {
    const orphanages = await this.orphanageRepository.find();
    console.log(orphanages);
    return await orphanages;
  }

  async findOne(id: number) {
    // 보육원 계정 & 보육원 정보 가져오기
    try {
      const orphanage = await this.orphanageUserRepository
        .createQueryBuilder('orphanage_user')
        .select([
          'orphanage.orphanage_name',
          'orphanage.address',
          'orphanage.homepage_link',
          'orphanage.phone_number',
          'orphanage.description',
          'orphanage.photo',
          'orphanage_user.name',
          'orphanage_user.orphanage_user_id',
        ])
        .leftJoin('orphanage_user.orphanage_id', 'orphanage')
        .where('orphanage_user.orphanage_id = :id', { id })
        .getOne();

      if (!orphanage)
      {
        console.log(`해당 보육원을 찾지 못 했습니다. orphanage_id : ${id}`);
        throw new NotFoundException('해당 보육원을 찾지 못 했습니다.');
      }

      const orphanage_user_id = orphanage.orphanage_user_id;

      const getRequests = await this.requestRepository
        .createQueryBuilder('requests')
        .where('requests.orphanage_user_id.orphanage_user_id = :orphanage_user_id', {
          orphanage_user_id,
        })
        .leftJoinAndSelect('requests.product_id', 'product')
        .getMany(); 

      const requests = getRequests.map((request) => ({
        request_id: request.request_id,
        product_name: request.product_id.product_name,
        price: request.product_id.price,
        count: request.count,
        supported_count: request.supported_count,
        message: request.message,
        product_photo: request.product_id.product_photo,
      }))

      const { name, email, orphanage_id: orphanageInfo } = orphanage;
      console.log(orphanageInfo);
      return { name, email, ...orphanageInfo, requests };

    } catch (error) {
      console.log(error);
      return error['response'];
    }

  }

  async createFavorite(user_id, orphanage_id) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      const orphanage = await this.orphanageRepository.findOne({
          where: {orphanage_id: orphanage_id}
      })
  
      if(!orphanage){
          throw new NotFoundException('해당 보육원을 찾을 수 없습니다.');
      }
  
      const user = await this.userRepository.findOne({
          where: {userId: user_id}
      })
  
      if(!user){
          throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }
  
      const exist = await this.favsRepository
      .createQueryBuilder('favorites')
      .where('favorites.orphanage_id.orphanage_id = :orphanage_id', { orphanage_id })
      .andWhere('favorites.user_id.user_id = :user_id', { user_id })
      .getOne();
  
      if (exist){
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

  async findUserFavorites({user})
  {
    try{
    } catch(error) {

    }
  }
}
