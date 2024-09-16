import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { DataSource, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as uuid from 'uuid';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
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
        await this.userRepository.findOne({
          where: [{ nickname: nickname }, { email }],
        })
      ) {
        throw new ConflictException('존재하는 이메일 또는 닉네임입니다.');
      }

      if (password.includes(name)) {
        throw new BadRequestException(
          'password는 name과 같은 문자열을 포함할 수 없습니다.',
        );
      }

      console.log('유저 생성 시작');
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

  async findAllUser(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.name',
        'user.email',
        'user.age',
        'user.sex',
        'user.nickname',
        'user.region',
        'user.phone_number',
        'user.profile_photo',
        'user.role',
      ])
      .getMany();
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.user_id=:id', { id: userId })
      .select([
        'user.name',
        'user.email',
        'user.age',
        'user.sex',
        'user.nickname',
        'user.region',
        'user.phone_number',
        'user.profile_photo',
        'user.role',
      ])
      .getOne();
    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }
    return user;
  }

  async findUserByNickname(nickname: string) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.nickname LIKE :nickname', { nickname: `%${nickname}%` })
      .select([
        'user.name',
        'user.email',
        'user.age',
        'user.sex',
        'user.nickname',
        'user.region',
        'user.phone_number',
        'user.profile_photo',
        'user.role',
      ])
      .getMany();
    if (!users) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }
    return users;
  }

  async updateUserById(userId: string, updateUserDto: UpdateUserDto) {
    const {
      name,
      password,
      email,
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
      const checkUser = await this.userRepository.findOne({
        where: { nickname: nickname },
      });

      if (checkUser && checkUser.user_id != userId) {
        throw new ConflictException('존재하는 닉네임입니다.');
      }

      this.userRepository.update(
        { user_id: userId },
        {
          name,
          password,
          email,
          age,
          sex,
          nickname,
          region,
          phone_number: phoneNumber,
          profile_photo: profilePhoto,
        },
      );

      console.log(`update UserInfo : ${userId}`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUserById(userId: string) {
    const user = await this.findUserById(userId);
    return this.userRepository.remove(user);
  }
}
