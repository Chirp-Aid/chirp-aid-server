import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
      phone_number,
      profile_photo,
    } = createUserDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (
        await this.usersRepository.findOne({ where: [{ nickName: nickname }, { email }] })
      ) {
        throw new ConflictException('존재하는 이메일 또는 닉네임입니다.');
      }

      const newUser = new User();
      newUser.userId = uuid.v1();
      newUser.name = name;
      newUser.email = email;
      newUser.password = password;
      newUser.age = age;
      newUser.sex = sex;
      newUser.nickName = nickname;
      newUser.region = region;
      newUser.phoneNumber = phone_number;
      newUser.profilePhoto = profile_photo;

      const user = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();
      console.log(`save User : ${user.email}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      return error['response'];
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserInfo(userId: string, updateUserDto: UpdateUserDto){
    const {
      name,
      password,
      age,
      sex,
      nickname,
      region,
      phone_number,
      profile_photo,
    } = updateUserDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const checkuser = await this.usersRepository.findOne({
        where: {nickName: nickname}
      });

      if (checkuser.userId != userId){
        throw new ConflictException('존재하는 닉네임입니다.');
      }
      
      this.usersRepository.update(
        {userId: userId},
        {name:name,
          password: password,
          age: age,
          sex: sex,
          nickName: nickname,
          region: region,
          phoneNumber: phone_number,
          profilePhoto: profile_photo});

      console.log(`update UserInfo : ${userId}`);
      await queryRunner.commitTransaction();

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      return error['response'];

    } finally {
      await queryRunner.release();
    }

  }


  async getUserInfo(user_id: string){
    try{
      const getUser = await this.usersRepository.findOne({where: {userId: user_id}})
      delete getUser.userId;
      delete getUser.password;
      delete getUser.refreshToken;
      delete getUser.fcmToken;
      
      console.log(`Get UserInfo : ${getUser.email}`);
      return getUser;

    } catch (error) {
      console.log(error['response']);
      return error['response'];
    }

  }
}
