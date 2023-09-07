import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { SaveFcmDto } from '../auth/dto/save-fcm.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  getAccessToken({ user }) {
    return this.jwtService.sign(
      {
        email: user.email,
        sub: user.user_id,
      },
      {
        secret: process.env.JWT_ACCESS_TOKEN,
        expiresIn: '1d',
      },
    );
  }

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.user_id,
      },
      {
        secret: process.env.JWT_REFRESH_TOKEN,
        expiresIn: '1w',
      },
    );
    res.setHeader(`refreshToekn`, refreshToken);
    return refreshToken;
  }

  async login(loginUserDto: LoginDto, res: Response) {
    const { email, password } = loginUserDto;
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      console.log(`unexisted email: ${email}`);
      throw new NotFoundException('존재하지 않는 이메일입니다.');
    }

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      console.log(`wrong password: ${email}`);
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
    }

    const refresh_token = this.setRefreshToken({ user, res });
    this.saveRefreshToken(user.user_id, refresh_token);
    const jwt = this.getAccessToken({ user });
    console.log(`succeed Login : ${user.email}`);
    return jwt;
  }

  async saveRefreshToken(userId: string, newToken: string) {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ refresh_token: newToken })
      .where('user_id = :userId', { userId })
      .execute();
  }

  //여기서 본인의 정보를 업데이트 하는지 한 번 더 확인하는 부분 추가 구현 필요
  async saveFcmToken(fcmToken: string, email: string, user_id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: email },
      });
      if (!user) {
        console.log(`unexisted email: ${email}`);
        throw new NotFoundException('존재하지 않는 이메일입니다.');
      }

      // if (user.user_id != user_id){
      //   console.log(`AT is different from UserInfo: ${email}`);
      //   throw new UnauthorizedException(`AT와 사용자의 정보가 일치하지 않습니다.`);
      // }

      await this.dataSource.transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .update(User)
          .set({ fcm_token: fcmToken })
          .where('email = :email', { email })
          .execute();
      });
    } catch (error) {
      console.log(error['response']);
      return error['response'];
    }
    return await this.usersRepository.findOne({
      where: { email: email },
      select: [
        'email',
        'name',
        'age',
        'sex',
        'nickname',
        'region',
        'phone_number',
        'profile_photo',
      ],
    });
  }

  async restoreAccessToken({ user }) {
    const jwt = this.getAccessToken({ user });
    console.log(`restore AT for User : ${user.email}`);
    return jwt;
  }
}
