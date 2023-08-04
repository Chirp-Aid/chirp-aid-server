import { Injectable } from '@nestjs/common';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from './dto/update-orphanage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orphanage } from './entities/orphanage.entity';
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

  findOne(id: number) {
    return `This action returns a #${id} orphanage`;
  }

  update(id: number, updateOrphanageDto: UpdateOrphanageDto) {
    return `This action updates a #${id} orphanage`;
  }

}
