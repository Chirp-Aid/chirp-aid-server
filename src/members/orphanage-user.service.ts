import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { OrphanageUser } from '../entities/orphanage-user.entity';
import { CreateOrphanageUserDto } from './dto/create-orphanage-user.dto';
import { Orphanage } from 'src/entities/orphanage.entity';
import { UpdateOrphanageUserDto } from './dto/update-orphanage-user.dto';
import { Request } from 'src/entities/request.entity';

@Injectable()
export class OrphanageUsersService {
  constructor(
    @InjectRepository(OrphanageUser)
    private usersRepository: Repository<OrphanageUser>,
    @InjectRepository(Orphanage)
    private orphanageRepository: Repository<Orphanage>,
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    private dataSource: DataSource,
  ) {}

  async create(createOrphanageUserDto: CreateOrphanageUserDto) {
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
      if (await this.usersRepository.findOne({ where: { email } })) {
        throw new ConflictException('존재하는 이메일입니다.');
      }

      const orphanage = await this.orphanageRepository.findOne({
        where: { orphanage_name: orphanageName },
      });

      if (!orphanage) {
        throw new NotFoundException('해당 보육원을 찾을 수 없습니다.');
      }

      const newUser = new OrphanageUser();
      newUser.orphanage_user_id = uuid.v1();
      newUser.name = name;
      newUser.email = email;
      newUser.password = password;
      newUser.orphanage_id = orphanage;

      const user = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();
      console.log(`save OrphanageUser : ${user.email}`);
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

  async updateUserInfo(userId: string, updateUserDto: UpdateOrphanageUserDto) {
    const { name, password } = updateUserDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.usersRepository.update(
        { orphanage_user_id: userId },
        { name: name, password: password },
      );

      console.log(`update OrphanageUserInfo : ${userId}`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserInfo(userId: string) {
    try {
      const info = await this.usersRepository
        .createQueryBuilder('orphanage_user')
        .select([
          'orphanage_user.email as email',
          'orphanage_user.name as name',
          'o.orphanage_id as orphanage_id',
          'o.orphanage_name as orphanage_name',
          'o.address as address',
          'o.homepage_link as homepage_link',
          'o.phone_number as phone_number',
          'o.description as description',
          'o.photo as photo',
          'orphanage_user.orphanage_user_id as orphanage_user_id',
        ])
        .innerJoin(
          'orphanage',
          'o',
          'orphanage_user.orphanage_id=o.orphanage_id',
        )
        .where('orphanage_user.orphanage_user_id = :orphanage_user_id', {
          orphanage_user_id: userId,
        })
        .getRawOne();

      if (!info) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      return info;
    } catch (error) {
      console.log(error['response']);
      throw error;
    }
  }
}
