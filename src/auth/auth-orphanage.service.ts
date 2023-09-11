import {
  Injectable,
  NotFoundException,
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
    private orphanageRepository: Repository<OrphanageUser>,
    private dataSource: DataSource,
  ) {}

  getAccessToken({ orphanageUser, res }) {
    const accessToken = this.jwtService.sign(
      {
        email: orphanageUser.email,
        sub: orphanageUser.orphanage_user_id,
      },
      {
        secret: process.env.JWT_ACCESS_TOKEN,
        expiresIn: '1d',
      },
    );
    res.setHeader(`access-token`, accessToken);
    return accessToken;
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
    res.setHeader(`refresh-token`, refreshToken);
    return refreshToken;
  }

  async login(orphanageLoginDto: OrphanageLoginDto, res: Response) {
    const { email, password } = orphanageLoginDto;
    const user = await this.orphanageRepository.findOne({
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
    await this.getAccessToken({ orphanageUser: user, res });
    console.log(`succeed OrphanageUser Login : ${user.email}`);
  }

  async saveRefreshToken(userId: string, newToken: string) {
    await this.orphanageRepository
      .createQueryBuilder()
      .update(OrphanageUser)
      .set({ refreshToken: newToken })
      .where('orphanage_user_id = :userId', { userId })
      .execute();
  }

  //여기서 본인의 정보를 업데이트 하는지 한 번 더 확인하는 부분 추가 구현 필요
  async saveFcmToken(req) {
    const email = req.user.email;
    const fcmToken = req.headers['fcm-token'];

    try {
      const user = await this.orphanageRepository.findOne({
        where: { email: email },
      });
      if (!user) {
        console.log(`unexisted email: ${email}`);
        throw new NotFoundException('존재하지 않는 이메일입니다.');
      }

      await this.dataSource.transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .update(OrphanageUser)
          .set({ fcmToken: fcmToken })
          .where('email = :email', { email })
          .execute();
      });
    } catch (error) {
      console.log(error['response']);
      return error['response'];
    } //finally {
    //   return this.orphanageRepository
    //     .createQueryBuilder('user')
    //     .select(['user.name', 'user.email', 'orphanage.orphanage_name'])
    //     .innerJoin('user.orphanage', 'orphanage')
    //     .where('user.email = :email', { email })
    //     .getOne();
    // }
  }

  async restoreAccessToken({ user, res }) {
    await this.getAccessToken({ orphanageUser: user, res });
    console.log(`restore AT for OrphanageUser : ${user.email}`);
  }
}
