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
    const { name, email, password, orphanage_name } = createOrphanageUserDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (await this.usersRepository.findOne({ where: { email } })) {
        throw new ConflictException('존재하는 이메일입니다.');
      }

      const orphange = await this.orphanageRepository.findOne({
        where: { orphanage_name: orphanage_name },
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
          `이미 해당 보육원의 계정은 존재합니다. or_name: ${orphanage_name}`,
        );
        return {
          statusCode: 409,
          message: '이미 해당 보육원의 계정은 존재합니다.',
          error: 'Conflict',
        };
      }
      console.log(error['response']);
      return error['response'];
    } finally {
      await queryRunner.release();
    }
  }
}
