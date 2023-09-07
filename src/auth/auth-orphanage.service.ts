import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { OrphanageUser } from '../entities/orphanage-user.entity';
import { OrphanageLoginDto } from './dto/orphanage-login.dto';

@Injectable()
export class OrphanageAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(OrphanageUser)
    private orphanageUserRepository: Repository<OrphanageUser>,
    private dataSource: DataSource,
  ) {}

  getAccessToken({ orphanageUser }) {
    return this.jwtService.sign(
      {
        email: orphanageUser.email,
        sub: orphanageUser.orphanage_user_id,
      },
      {
        secret: process.env.JWT_ACCESS_TOKEN,
        expiresIn: '1d',
      },
    );
  }

  setRefreshToken({ orphanageUser, res }) {
    const refreshToken = this.jwtService.sign(
      {
        email: orphanageUser.email,
        sub: orphanageUser.orphanage_user_id,
      },
      {
        secret: process.env.JWT_REFRESH_TOKEN,
        expiresIn: '1w',
      },
    );
    res.setHeader(`refreshToekn`, refreshToken);
    return refreshToken;
  }

  async login(orphanageLoginDto: OrphanageLoginDto, res: Response) {
    const { email, password } = orphanageLoginDto;
    const user = await this.orphanageUserRepository.findOne({
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

    const refresh_token = this.setRefreshToken({ orphanageUser: user, res });
    this.saveRefreshToken(user.orphanage_user_id, refresh_token);
    const jwt = this.getAccessToken({ orphanageUser: user });
    console.log(`succeed OrphanageUser Login : ${user.email}`);
    return jwt;
  }

  async saveRefreshToken(userId: string, newToken: string) {
    await this.orphanageUserRepository
      .createQueryBuilder()
      .update(OrphanageUser)
      .set({ refresh_token: newToken })
      .where('orphanage_user_id = :userId', { userId })
      .execute();
  }

  //여기서 본인의 정보를 업데이트 하는지 한 번 더 확인하는 부분 추가 구현 필요
  async saveFcmToken(fcmToken: string, email: string, orphanage_user_id: string) {

    
    try {
      const user = await this.orphanageUserRepository.findOne({
        where: { email: email },
      });
      if (!user) {
        console.log(`unexisted email: ${email}`);
        throw new NotFoundException('존재하지 않는 이메일입니다.');
      }

      // if (user.orphanage_user_id != orphanage_user_id){
      //   console.log(`AT is different from UserInfo: ${email}`);
      //   throw new UnauthorizedException(`AT와 사용자의 정보가 일치하지 않습니다.`);
      // }

      await this.dataSource.transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .update(OrphanageUser)
          .set({ fcm_token: fcmToken })
          .where('email = :email', { email })
          .execute();
      });

    } catch (error) {
      console.log(error['response']);
      return error['response'];

    } finally {
      return this.orphanageUserRepository
        .createQueryBuilder('orphanage_user')
        .select(['orphanage_user.name', 'orphanage_user.email', 'orphanage.orphanage_name'])
        .innerJoin('orphanage_user.orphanage_id', 'orphanage')
        .where('orphanage_user.email = :email', { email })
        .getOne();
    }
  }

  async restoreAccessToken({ user }) {
    const jwt = this.getAccessToken({ orphanageUser: user });
    console.log(`restore AT for OrphanageUser : ${user.email}`);
    return jwt;
  }
}
