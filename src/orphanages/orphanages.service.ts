import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orphanage } from '../entities/orphanage.entity';
import { DataSource, Repository } from 'typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Request } from 'src/entities/request.entity';
import { UpdateOrphanageDto } from './dto/updateOrphanage.dto';

@Injectable()
export class OrphanagesService {
  constructor(
    @InjectRepository(Orphanage)
    private orphanageRepository: Repository<Orphanage>,
    @InjectRepository(OrphanageUser)
    private orphanageUserRepository: Repository<OrphanageUser>,
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    const orphanages = await this.orphanageRepository.find();
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

      console.log(orphanage);

      if (!orphanage) {
        throw new NotFoundException('해당 보육원을 찾지 못 했습니다.');
      }

      const orphanageUserId = orphanage.orphanage_user_id;

      const requests = await this.requestRepository
        .createQueryBuilder('requests')
        .select([
          'requests.request_id as request_id',
          'p.product_name as product_name',
          'p.price as price',
          'requests.count as count',
          'requests.supported_count as supported_count',
          'requests.state as state',
          'requests.message as message',
          'p.product_photo as product_photo',
        ])
        .innerJoin('requests.product_id', 'p')
        .where(
          'requests.orphanage_user_id.orphanage_user_id = :orphanage_user_id',
          { orphanage_user_id: orphanageUserId },
        )
        .getRawMany();

      const { name, email, orphanage_id: orphanageInfo } = orphanage;
      return { name, email, ...orphanageInfo, requests };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateOrphanage(updateOrphanageDto:UpdateOrphanageDto){
    const {orphanage_id, orphanage_name, address, homepage_link, phone_number, description, photo} = updateOrphanageDto;
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isExist = await this.orphanageRepository.findOne({
        where: { orphanage_id: orphanage_id},
      });

      if (!isExist) {
        throw new NotFoundException('해당 보육원은 존재하지 않습니다.');
      }
      console.log(updateOrphanageDto);

      this.orphanageRepository.update(
        { orphanage_id: orphanage_id },
        {
          orphanage_name: orphanage_name,
          address: address,
          homepage_link: homepage_link,
          phone_number: phone_number,
          description: description,
          photo: photo,
        },
      );

      console.log(`update OrphanageInfo : ${orphanage_id}`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
