import { Injectable } from '@nestjs/common';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from './dto/update-orphanage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orphanage } from '../entities/orphanage.entity';
import { DataSource, Repository } from 'typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';

@Injectable()
export class OrphanagesService {
  constructor(
    @InjectRepository(Orphanage) private orphanageRepository: Repository<Orphanage>,
    @InjectRepository(OrphanageUser) private orphanageUserRepository: Repository<OrphanageUser>,
    private dataSource: DataSource,
  ){}

  async findAll() {
    const orphanages = await this.orphanageRepository.find();
    console.log(orphanages);
    return await orphanages;
  }

  async findOne(id: number) {
    const result = await this.orphanageUserRepository
    .createQueryBuilder('orphanage_user')
    .select([
      'orphanage.orphanage_name',
      'orphanage.address',
      'orphanage.homepage_link',
      'orphanage.phone_number',
      'orphanage.description',
      'orphanage.photo',
      'orphanage_user.name',
      'orphanage_user.email',
    ])
    .leftJoin('orphanage_user.orphanage_id', 'orphanage')
    .where('orphanage_user.orphanage_id = :id', { id })
    .getOne();
  
    if (result) {
      const { name, email, orphanage_id: orphanageInfo } = result;
      console.log(orphanageInfo);
      return { name, email, ...orphanageInfo };
    }
  
  }
}
