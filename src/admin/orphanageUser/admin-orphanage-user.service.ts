import { InjectRepository } from '@nestjs/typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrphanageUserDto } from './dto/create-orphanage-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid';
import { UpdateOrphanageUserDto } from './dto/update-orphanage-user.dto';
import { Orphanage } from 'src/entities/orphanage.entity';

export class AdminOrphanageUsersService {
  constructor(
    @InjectRepository(OrphanageUser)
    private orphanageUserRepository: Repository<OrphanageUser>,
    @InjectRepository(Orphanage)
    private orphanageRepository: Repository<Orphanage>,
    private dataSource: DataSource,
  ) {}

  async createOrphanageUser(createOrphanageUserDto: CreateOrphanageUserDto) {
    const {
      name,
      email,
      password,
      orphanage_name: orphanageName,
    } = createOrphanageUserDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (
        await this.orphanageUserRepository.findOne({
          where: [{ email }],
        })
      ) {
        throw new ConflictException('존재하는 이메일입니다.');
      }

      const orphanage = await this.orphanageRepository.findOne({
        where: { orphanage_name: orphanageName },
      });

      if (!orphanage) {
        throw new NotFoundException('해당 보육원을 찾을 수 없습니다.');
      }

      console.log('보육원 사용자 생성 시작');
      const newOrphanageUser = new OrphanageUser();
      newOrphanageUser.orphanage_user_id = uuid.v1();
      newOrphanageUser.name = name;
      newOrphanageUser.email = email;
      newOrphanageUser.password = password;
      newOrphanageUser.orphanage = orphanage;

      const user = await queryRunner.manager.save(newOrphanageUser);
      await queryRunner.commitTransaction();
      console.log(`save Orphanage User: ${user.email}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.errno == 1062) {
        console.log(
          `이미 해당 보육원의 계정은 존재합니다. or_name: ${orphanageName}`,
        );
        throw new ConflictException('이미 해당 보육원의 계정은 존재합니다');
      }
      console.log(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOrphanageUsers(): Promise<OrphanageUser[]> {
    return await this.orphanageUserRepository
      .createQueryBuilder('orphanage_user')
      .select([
        'orphanage_user.orphanage_user_id',
        'orphanage_user.name',
        'orphanage_user.email',
        'o.orphanage_id',
      ])
      .innerJoin('orphanage_user.orphanage_id', 'o')
      .getMany();
  }

  async findOrphanageUserById(orphanageUserId: string): Promise<OrphanageUser> {
    const orphanageUser = await this.orphanageUserRepository
      .createQueryBuilder('orphanage_user')
      .where('orphanage_user.orphanage_user_id=:orphanageUserId', {
        id: orphanageUserId,
      })
      .select(['orphanage_user.name', 'orphanage_user.email', 'o.orphanage_id'])
      .innerJoin('orphanage_user.orphanage_id', 'o')
      .getOne();
    if (!orphanageUser) {
      throw new NotFoundException('해당 보육원 사용자가 존재하지 않습니다.');
    }
    return orphanageUser;
  }

  async findOrphanageUserByName(name: string): Promise<OrphanageUser[]> {
    return await this.orphanageUserRepository
      .createQueryBuilder('orphanage_user')
      .where('orphanage_user.name LIKE :name', { name: `%${name}%` })
      .select(['orphanage_user.name', 'orphanage_user.email', 'o.orphanage_id'])
      .innerJoin('orphanage_user.orphanage_id', 'o')
      .getMany();
  }

  async updateOrphanageUserById(
    orphanageUserId: string,
    updateOrphanageUserDto: UpdateOrphanageUserDto,
  ) {
    const { name, email } = updateOrphanageUserDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const checkUser = await this.orphanageUserRepository.findOne({
        where: { email },
      });

      if (checkUser && checkUser.orphanage_user_id != orphanageUserId) {
        throw new ConflictException('존재하는 닉네임입니다.');
      }

      this.orphanageUserRepository.update(
        { orphanage_user_id: orphanageUserId },
        { name, email },
      );

      console.log(`update UserInfo : ${orphanageUserId}`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteOrphanageUserById(orphanageUserId: string) {
    const orphanage_user = await this.orphanageUserRepository.findOne({
      where: { orphanage_user_id: orphanageUserId },
    });
    if (!orphanage_user) {
      throw new NotFoundException('해당하는 보육원 계정이 없습니다.');
    }

    await this.orphanageUserRepository.remove(orphanage_user);
  }
}
