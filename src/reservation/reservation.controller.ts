import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('RESERVATION: 방문 예약 관련 요청')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({
    summary: '방문 예약 신청',
    description: '사용자가 특정 보육원에 방문 예약을 신청합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found - 해당 물품을 찾을 수 없습니다.\
      \nNot Found - 해당 사용자를 찾을 수 없습니다.\
      \nNot Found - 해당 보육원 계정을 찾을 수 없습니다. 보육원에 직접 문의바랍니다.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - 이미 해당 보육원의 같은 방문 일시로 예약을 신청하였습니다.',
  })
  @UseGuards(AuthGuard('access'))
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req,
  ) {
    const userId = req.user.user_id;
    return await this.reservationService.create(createReservationDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: '방문 예약 신청 내역 조회',
    description:
      '사용자의 방문 예약 신청 내역들을 조회합니다.\
        \n예약 상태 : APPROVED(승인됨), REJECTED(거절됨), PENDING(대기 중), COMPLETED(완료))',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      example: [
        {
          orphanage_name: '보육원1',
          write_date: '2023-09-27 05:29:36',
          visit_date: '2023-10-24',
          reason: '방문 신청해요~~~',
          state: 'PENDING',
        },
        {
          orphanage_name: '보육원2',
          write_date: '2023-05-01 17:36:02',
          visit_date: '2023-06-30',
          reason: '방문 신청 합니다.',
          state: 'COMPLETED',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found - 해당 물품을 찾을 수 없습니다.\
      \nNot Found - 해당 사용자를 찾을 수 없습니다.',
  })
  @UseGuards(AuthGuard('access'))
  async getReservatino(@Request() req) {
    const userId = req.user.user_id;
    return await this.reservationService.get(userId);
  }
}
