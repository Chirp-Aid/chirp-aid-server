import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { User } from 'src/entities/user.entity';
import { Orphanage } from 'src/entities/orphanage.entity';
import { Reservation } from 'src/entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrphanageUser,
      User,
      Orphanage,
      Reservation
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
