import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminBoardController } from './admin-board.controller';
import { AdminBoardService } from './admin-board.service';
import { Request } from 'src/entities/request.entity';
import { Review } from 'src/entities/review.entity';
import { Reservation } from 'src/entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, Review, Reservation])],
  controllers: [AdminBoardController],
  providers: [AdminBoardService],
})
export class AdminBoardModule {}
