import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { throwError } from 'rxjs';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private dataSource: DataSource
    ){}

    async create(createUserDto: CreateUserDto) {
        const {name, email, password, age, sex, nickname, region, phone_number, profile_photo} = createUserDto;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const newUser = new User();
            newUser.name= name;
            newUser.email= email;
            newUser.password= password;
            newUser.age= age;
            newUser.sex= sex;
            newUser.nickname= nickname;
            newUser.region= region;
            newUser.phone_number= phone_number;
            newUser.profile_photo= profile_photo;
        
            await queryRunner.manager.save(newUser);

            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            return 'failed to save User'
        } finally {
            await queryRunner.release(); // 6
        }
        return createUserDto;
    
    
    
    }

    findAll() {
    return `This action returns all members`;
    }

    async getByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where:{email: email}
        });
        
        if (user) {
            return user;
        }
        throw new HttpException(
            '사용자 이메일이 존재하지 않습니다.',
            HttpStatus.NOT_FOUND,
        );
    }

    update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
    }

    remove(id: number) {
    return `This action removes a #${id} member`;
    }
}
