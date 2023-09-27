import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(OrphanageUser) private orphanageUserRepository: Repository<OrphanageUser>,
        private dataSource: DataSource
    ){}

    async create(createReservationDto: CreateReservationDto, userId: string){
        const {orphanage_id: orphanageId, visit_date: visitDate, reason} = createReservationDto;
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const user = await this.userRepository.findOne({where:{user_id:userId}})
            if(!user){
                throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
            }

            const orphanageUser = await this.orphanageUserRepository
                .createQueryBuilder('orphanage_user')
                .select([
                    'orphanage_user.orphanage_user_id',
                    'o.orphanage_id'
                ])
                .innerJoin('orphanage_user.orphanage_id', 'o')
                .where('orphanage_user.orphanage_id.orphanage_id = :orphanage_id', {orphanage_id: orphanageId})
                .getOne();
                
            if(!orphanageUser){
                throw new NotFoundException('해당 보육원 계정을 찾을 수 없습니다. 보육원에 직접 문의바랍니다.');
            }
            
            const exist = await this.reservationRepository
            .createQueryBuilder('reservation')
            .innerJoin('reservation.user', 'user_id')
            .where('user_id.user_id = :user_id', {user_id: userId})
            .andWhere('reservation.orphanage = :orphanage_id', {orphanage_id: orphanageId})
            .andWhere('reservation.visit_date = :date', {date: visitDate})
            .getOne();
            
            if(exist) {
                throw new ConflictException('이미 해당 보육원의 같은 방문 일시로 예악을 신청하였습니다.');
            }

            const reservation = new Reservation();
            const currentTime = moment.tz('Asia/Seoul').format('YYYY-MM-DD hh:mm:ss')
            reservation.writeDate = currentTime;
            reservation.visitDate = visitDate;
            reservation.reason = reason;
            reservation.user = user;
            reservation.orphanage = orphanageUser.orphanage_id;
            
            await this.reservationRepository.save(reservation);

            await queryRunner.commitTransaction();

        } catch(error){
            await queryRunner.rollbackTransaction();
            console.error(error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async get(userId: string){
        try{
            const user = await this.userRepository.findOne({where:{user_id:userId}})
            if(!user){
                throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
            }

            const reservations = await this.reservationRepository
                .createQueryBuilder('reservation')
                .select([
                    'o.orphanage_name as orphanage_name',
                    'reservation.write_date as write_date',
                    'reservation.visit_date as visit_date',
                    'reservation.reason as reason',
                    'reservation.state as state'
                ])
                .where('reservation.user.user_id = :user_id', {user_id: userId})
                .innerJoin('reservation.orphanage', 'o')
                .getRawMany();

            console.log(reservations);

            return reservations;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
