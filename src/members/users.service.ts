import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as uuid from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,

    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const {
      name,
      email,
      password,
      age,
      sex,
      nickname,
      region,
      phone_number: phoneNumber,
      profile_photo: profilePhoto,
      role,
    } = createUserDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (
        await this.usersRepository.findOne({
          where: [{ nickname: nickname }, { email }],
        })
      ) {
        throw new ConflictException('존재하는 이메일 또는 닉네임입니다.');
      }

      const newUser = new User();
      newUser.user_id = uuid.v1();
      newUser.name = name;
      newUser.email = email;
      newUser.password = password;
      newUser.age = age;
      newUser.sex = sex;
      newUser.nickname = nickname;
      newUser.region = region;
      newUser.phone_number = phoneNumber;
      newUser.profile_photo = profilePhoto;
      newUser.role = role === 'admin' ? 'admin' : 'user';

      const user = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();
      console.log(`save User : ${user.email}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserInfo(userId: string, updateUserDto: UpdateUserDto) {
    const {
      name,
      password,
      age,
      sex,
      nickname,
      region,
      phone_number: phoneNumber,
      profile_photo: profilePhoto,
    } = updateUserDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const checkUser = await this.usersRepository.findOne({
        where: { nickname: nickname },
      });

      if (checkUser && checkUser.user_id != userId) {
        throw new ConflictException('존재하는 닉네임입니다.');
      }

      this.usersRepository.update(
        { user_id: userId },
        {
          name: name,
          password: password,
          age: age,
          sex: sex,
          nickname: nickname,
          region: region,
          phone_number: phoneNumber,
          profile_photo: profilePhoto,
        },
      );

      console.log(`update UserInfo : ${userId}`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserInfo(userId: string) {
    try {
      const getUser = await this.usersRepository.findOne({
        where: { user_id: userId },
      });

      if (!getUser) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

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
