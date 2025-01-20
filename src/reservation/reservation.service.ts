import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import * as moment from 'moment-timezone';
import { changeReservationDto } from './dto/change-reservation.dto';
import { FcmService } from 'src/notifications/fcm.service';
import { NotificationDto } from 'src/notifications/dto/notification.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(OrphanageUser)
    private orphanageUserRepository: Repository<OrphanageUser>,
    private dataSource: DataSource,
    private fcmService: FcmService,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    const {
      orphanage_id: orphanageId,
      visit_date: visitDate,
      reason,
    } = createReservationDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });
      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const orphanageUser = await this.orphanageUserRepository
        .createQueryBuilder('orphanage_user')
        .select([
          'orphanage_user.orphanage_user_id',
          'o.orphanage_id',
          'orphanage_user.fcm_token',
        ])
        .innerJoin('orphanage_user.orphanage_id', 'o')
        .where('orphanage_user.orphanage_id.orphanage_id = :orphanage_id', {
          orphanage_id: orphanageId,
        })
        .getOne();

      if (!orphanageUser) {
        throw new NotFoundException(
          '해당 보육원 계정을 찾을 수 없습니다. 보육원에 직접 문의바랍니다.',
        );
      }

      const exist = await this.reservationRepository
        .createQueryBuilder('reservation')
        .innerJoin('reservation.user', 'user_id')
        .where('user_id.user_id = :user_id', { user_id: userId })
        .andWhere('reservation.orphanage = :orphanage_id', {
          orphanage_id: orphanageId,
        })
        .andWhere('reservation.visit_date = :date', { date: visitDate })
        .getOne();

      if (exist) {
        throw new ConflictException(
          '이미 해당 보육원의 같은 방문 일시로 예악을 신청하였습니다.',
        );
      }

      const reservation = new Reservation();
      const currentTime = moment.tz('Asia/Seoul').format('YYYY-MM-DD hh:mm:ss');
      reservation.writeDate = currentTime;
      reservation.visitDate = visitDate;
      reservation.reason = reason;
      reservation.user = user;
      reservation.orphanage = orphanageUser.orphanage_id;

      await this.reservationRepository.save(reservation);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserReservation(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });
      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .select([
          'o.orphanage_name as orphanage_name',
          'reservation.write_date as write_date',
          'reservation.visit_date as visit_date',
          'reservation.reason as reason',
          'reservation.state as state',
          'reservation.reject_reason as reject_reason',
        ])
        .where('reservation.user.user_id = :user_id', { user_id: userId })
        .innerJoin('reservation.orphanage', 'o')
        .getRawMany();
      return reservations;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOrphanReservation(userId: string) {
    try {
      // orphanageUser를 찾기
      const orphanageUser = await this.orphanageUserRepository.findOne({
        where: { orphanage_user_id: userId },
        relations: ['orphanage_id'],
      });
      if (!orphanageUser) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      console.log(orphanageUser.orphanage_id.orphanage_id);

      // 방문 날짜가 지난 예약 상태를 REJECTED로 업데이트
      const currentDate = new Date();
      await this.reservationRepository
        .createQueryBuilder()
        .update('reservation')
        .set({ state: 'REJECTED' }) // state를 REJECTED로 설정
        .where('visit_date < :currentDate', { currentDate }) // 현재 날짜보다 방문 날짜가 이전인 경우
        .andWhere('state NOT IN (:...excludedStates)', {
          excludedStates: ['REJECTED', 'APPROVED'],
        }) // REJECTED와 APPROVED 제외
        .execute();

      // 업데이트된 예약 정보 조회
      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .select([
          'u.name as name',
          'u.age as age',
          'u.sex as sex',
          'u.region as region',
          'u.phone_number as phone_number',
          'reservation.reservation_id as reservation_id',
          'reservation.write_date as write_date',
          'reservation.visit_date as visit_date',
          'reservation.reason as reason',
          'reservation.state as state',
          'reservation.reject_reason as reject_reason',
        ])
        .where('reservation.orphanage.orphanage_id = :orphanage_id', {
          orphanage_id: orphanageUser.orphanage_id.orphanage_id,
        })
        .innerJoin('reservation.user', 'u')
        .getRawMany();

      console.log(reservations);
      return reservations;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async changeReservationState(changeDto: changeReservationDto) {
    const { reservation_id: reservationId, state, message } = changeDto;

    const reservation = await this.reservationRepository.findOne({
      where: { reservationId },
      relations: ['user'],
    });
    if (!reservation) {
      throw new NotFoundException('해당 예약을 찾을 수 없습니다.');
    }

    await this.reservationRepository
      .createQueryBuilder()
      .update(Reservation)
      .set({ state: state, rejectReason: message })
      .where('reservation_id = :reservationId', { reservationId })
      .execute();
    console.log(reservation);
    console.log(reservation.user.fcm_token);
    //fcm 사용자에게 전송하기..
    const payload = new NotificationDto();
    payload.deviceToken = reservation.user.fcm_token;
    if (state === 'APPROVED') {
      payload.title = '방문 신청 승인 알림';
      payload.body = '방문 신청이 승인되었어요.';
      payload.data = { type: 'RESERVATION', info: 'APPROVED' };
    } else {
      payload.title = '방문 신청 거절 알림';
      payload.body = `방문 신청이 거절되었어요.\n거절 사유: ${message}`;
      payload.data = { type: 'RESERVATION', info: 'REJECTED' };
    }
    this.fcmService.sendNotification(payload);
  }
}
