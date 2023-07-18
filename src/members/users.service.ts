import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private dataSource: DataSource,
        private authService: AuthService
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
            return user;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error.message);
            return new HttpException(error.message, HttpStatus.BAD_REQUEST)
        } finally {
            await queryRunner.release();
        }
    }

    async login(email: string, password: string, res: Response) {
        const user = await this.usersRepository.findOne({where: {email: email}})

        if(!user){
            throw new NotFoundException('존재하지 않는 이메일입니다.');
        }

        const isAuth = await bcrypt.compare(password, user.password);

        if(!isAuth){
            throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
        }

        // JWT Refresh Token 쿠키에 발급
        this.authService.setRefreshToken({user, res});
        // JWT Access Toekn 발급
        const jwt = this.authService.getAccessToken({user});

        return jwt
    }

    async findOne(id:number){
        const user = await this.usersRepository.findOne({
            where: {user_id : id}
        });

        return user;
    }
}
