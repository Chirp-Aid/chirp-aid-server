import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/members/entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { SaveFcmDto } from '../auth/dto/save-fcm.dto';
import { IOAuthUser } from 'src/auth/auth.userInterface';

@Injectable()
export class AuthService{
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User) private usersRepository: Repository<User>,
    ){}

    getAccessToken({user}) {
        return this.jwtService.sign({
            email: user.email,
            sub: user.user_id,
        },
        {
            secret: process.env.JWT_ACCESS_TOKEN,
            expiresIn: '1d',
        },
        );
    }

    setRefreshToken({user, res}) {
        const refreshToken = this.jwtService.sign({
            email: user.email,
            sub: user.user_id,
        },
        {
            secret: process.env.JWT_REFRESH_TOKEN,
            expiresIn: '2w',
        },
        );
        res.setHeader(`refreshToekn`,refreshToken);
        return refreshToken;
    }

    async login(loginUserDto: LoginDto, res: Response) {
        const {email, password} = loginUserDto;
        const user = await this.usersRepository.findOne({where: {email: email}})
        if(!user){
            console.log(`existed email: ${email}`);
            throw new NotFoundException('존재하지 않는 이메일입니다.');
        }

        const isAuth = await bcrypt.compare(password, user.password);
        if(!isAuth){
            console.log(`wrong password: ${email}`);
            throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
        }

        const refresh_token = this.setRefreshToken({user, res});
        this.saveRefreshToken(user.user_id, refresh_token);
        const jwt = this.getAccessToken({user});
        console.log(`succeed Login : ${user.email}`);
        return jwt
    }

    async saveRefreshToken(userId: string, newToken: string) {
        await this.usersRepository
            .createQueryBuilder()
            .update(User)
            .set({ refresh_token: newToken })
            .where('user_id = :userId', { userId })
            .execute();
    }

    async saveFcmToken(saveFcmDto: SaveFcmDto){
        const {email, fcmToken} = saveFcmDto;
        await this.usersRepository
            .createQueryBuilder()
            .update(User)
            .set({ fcm_token: fcmToken })
            .where('email = :email', { email })
            .execute();
        return 201;
    }
        
    async restoreAccessToken({user}){
        const jwt = this.getAccessToken({user});
        console.log(`succeed Login : ${user.email}`);
        return jwt
    }

}