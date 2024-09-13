import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orphanage } from 'src/entities/orphanage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Orphanage)
    private orphanageRepository: Repository<Orphanage>,
  ) {}

  async findAllOrphanage(): Promise<Orphanage[]> {
    return this.orphanageRepository.createQueryBuilder('orphanage').getMany();
  }

  async findOrphanageById(orphanageId: number): Promise<Orphanage> {
    const orphanage = await this.orphanageRepository
      .createQueryBuilder('orphanage')
      .where('orphanage.orphanage_id=:id', { id: orphanageId })
      .getOne();
    if (!orphanage) {
      throw new NotFoundException('해당 보육원이 존재하지 않습니다.');
    }
    return orphanage;
  }

  async deleteOrphanageById(orphanageId: number) {
    const orphanage = await this.orphanageRepository.findOne({
      where: { orphanage_id: orphanageId },
    });
    if (!orphanage) {
      throw new NotFoundException('해당하는 보육원이 존재하지 않습니다.');
    }
    return this.orphanageRepository.remove(orphanage);
  }
}
