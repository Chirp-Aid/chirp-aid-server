import { Injectable } from '@nestjs/common';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from './dto/update-orphanage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orphanage } from '../entities/orphanage.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrphanagesService {
  constructor(
    @InjectRepository(Orphanage) private orphanageRepository: Repository<Orphanage>,
    private dataSource: DataSource,
  ){}

  async findAll() {
    const orphanages = await this.orphanageRepository.find();
    console.log(orphanages);
    return await orphanages;
  }

  async findOne(id: number) {
    const orphanage = await this.orphanageRepository
    .createQueryBuilder('orphanage')
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
    .leftJoin('orphanage', 'orphanage_user.orphanage_id')
    .where({})
    .getMany();
  
    console.log(orphanage);
    
    return orphanage;
  
  }
}
