import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orphanage } from 'src/entities/orphanage.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from 'src/orphanages/dto/updateOrphanage.dto';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Orphanage)
    private orphanageRepository: Repository<Orphanage>,
    private dataSource: DataSource,
  ) {}

  async createOrphanage(createOrphanageDto: CreateOrphanageDto) {
    const {
      orphanage_name,
      address,
      homepage_link,
      phone_number,
      description,
      photo,
    } = createOrphanageDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (
        await this.orphanageRepository.findOne({
          where: { orphanage_name: orphanage_name },
        })
      ) {
        throw new ConflictException('이미 존재하는 보육원입니다.');
      }

      console.log('보육원 생성 시작');
      const newOrphanage = new Orphanage();
      newOrphanage.orphanage_name = orphanage_name;
      newOrphanage.address = address;
      newOrphanage.homepage_link = homepage_link;
      newOrphanage.phone_number = phone_number;
      newOrphanage.description = description;
      newOrphanage.photo = photo;

      const orphanage = await queryRunner.manager.save(newOrphanage);
      await queryRunner.commitTransaction();
      console.log(`save User : ${orphanage.orphanage_name}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

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

  async updateOrphanageById(
    orphanageId: number,
    updateOrphanageDto: UpdateOrphanageDto,
  ) {
    const {
      orphanage_name,
      address,
      homepage_link,
      phone_number,
      description,
      photo,
    } = updateOrphanageDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orphanage = await this.orphanageRepository.findOne({
        where: { orphanage_id: orphanageId },
      });
      if (!orphanage) {
        throw new NotFoundException('해당하는 보육원이 존재하지 않습니다.');
      }

      const isExistOrphanage = await this.orphanageRepository.findOne({
        where: { orphanage_name },
      });
      if (isExistOrphanage) {
        throw new ConflictException('이미 존재하는 보육원입니다.');
      }

      this.orphanageRepository.update(
        { orphanage_id: orphanageId },
        {
          orphanage_name: orphanage_name,
          address: address,
          homepage_link: homepage_link,
          phone_number: phone_number,
          description: description,
          photo: photo,
        },
      );

      console.log(`update orphanage : ${orphanage}`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
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
