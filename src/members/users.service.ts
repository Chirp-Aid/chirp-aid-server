import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as uuid from 'uuid';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private dataSource: DataSource,
    ){}

    async create(createUserDto: CreateUserDto) {
        const {name, email, password, age, sex, nickname, region, phone_number, profile_photo} = createUserDto;
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if(await this.usersRepository.findOne({
                where: [{ nickname }, { email }],
            })) {
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
            newUser.phone_number = phone_number;
            newUser.profile_photo = profile_photo;
            const user = await queryRunner.manager.save(newUser);
            await queryRunner.commitTransaction();
            console.log(`save User : ${user.email}`);
            return user;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error.message);
            return new HttpException(error.message, HttpStatus.BAD_REQUEST)
        } finally {
            await queryRunner.release();
        }
    }

    
}
