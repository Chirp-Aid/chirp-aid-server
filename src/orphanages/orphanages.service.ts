import { Injectable } from '@nestjs/common';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from './dto/update-orphanage.dto';

@Injectable()
export class OrphanagesService {
  create(createOrphanageDto: CreateOrphanageDto) {
    return 'This action adds a new orphanage';
  }

  findAll() {
    return `This action returns all orphanages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orphanage`;
  }

  update(id: number, updateOrphanageDto: UpdateOrphanageDto) {
    return `This action updates a #${id} orphanage`;
  }

  remove(id: number) {
    return `This action removes a #${id} orphanage`;
  }
}
