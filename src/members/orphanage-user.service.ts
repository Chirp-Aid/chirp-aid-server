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

@Injectable()
export class OrphanageUsersService {
  constructor(
    @InjectRepository(OrphanageUser)
    private usersRepository: Repository<OrphanageUser>,
    @InjectRepository(Orphanage)
    private orphanageRepository: Repository<Orphanage>,
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

      const orphange = await this.orphanageRepository.findOne({
        where: { orphanage_name: orphanageName },
      });

      if (!orphange) {
        throw new NotFoundException('해당 보육원을 찾을 수 없습니다.');
      }

      const newUser = new OrphanageUser();
      newUser.orphanage_user_id = uuid.v1();
      newUser.name = name;
      newUser.email = email;
      newUser.password = password;
      newUser.orphanage_id = orphange;

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

  async updateUserInfo(userId: string, udpateUserDto: UpdateOrphanageUserDto) {
    const { name, password } = udpateUserDto;

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
      const getUser = await this.usersRepository.findOne({
        where: { orphanage_user_id: userId },
      });

      if (!getUser) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }
      delete getUser.orphanage_user_id;
      delete getUser.password;
      delete getUser.refresh_token;
      delete getUser.fcm_token;

      console.log(`Get UserInfo : ${getUser.email}`);
      return getUser;
    } catch (error) {
      console.log(error['response']);
      throw error;
    }
  }
}
