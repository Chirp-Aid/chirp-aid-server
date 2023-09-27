import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService
    ) {}

    @Post()
    @UseGuards(AuthGuard('access'))
    async createReservation(@Body() createReservationDto: CreateReservationDto, @Request() req) {
      const userId = req.user.user_id;
      return await this.reservationService.create(createReservationDto, userId);
    }

    @Get()
    @UseGuards(AuthGuard('access'))
    async getReservatino(@Request() req){
      const userId = req.user.user_id;
      return await this.reservationService.get(userId);
    }
}
