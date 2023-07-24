import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { OrphanageUser } from './entities/orphanage-user.entity.ts';
import { CreateOrphanageUserDto } from './dto/create-orphanage-user.dto';
import { Orphanage } from 'src/orphanages/entities/orphanage.entity';

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
    const { name, email, password, orphanageName } = createOrphanageUserDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (await this.usersRepository.findOne({where: [{ email }],}))
      {
        throw new ConflictException('존재하는 이메일 또는 닉네임입니다.');
      }

      const orphange = await this.orphanageRepository.findOne({
        where: { orphanage_name: orphanageName },
      });

      const newUser = new OrphanageUser();
      newUser.orphanage_user_id = uuid.v1();
      newUser.name = name;
      newUser.email = email;
      newUser.password = password;
      newUser.orphanage = orphange;

      const user = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();

      console.log(`save OrphanageUser : ${user.email}`);

      return createOrphanageUserDto;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      return error['response'];
    } finally {
      await queryRunner.release();
    }
  }
}
