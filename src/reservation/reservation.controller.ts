import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { changeReservationDto } from './dto/change-reservation.dto';

@ApiTags('RESERVATION: 방문 예약 관련 요청')
@UseGuards(AuthGuard('access'))
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({
    summary: '방문 예약 신청',
    description: '사용자가 특정 보육원에 방문 예약을 신청합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - 날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 기입하여 주십시요.',
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
      '사용자 또는 보육원 계정 방문 예약 내역들을 조회합니다.\
      \n `사용자(user)` : 사용자의 방문 신청 내역들을 조회합니다.\
      \n `보육원 계정(orphange)` : 보육원 계정의 방문 신청들을 조회합니다.\
        \n예약 상태 : `APPROVED`(승인됨), `REJECTED`(거절됨), `PENDING`(대기 중), `COMPLETED`(완료)',
  })
  @ApiQuery({
    name: 'account',
    required: true,
    description:
      '어느 계정인지 명시해줍니다. 일반 사용자은 `user`, 보육원 계정은 `orphanage`로 명시해주세요.',
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
          reject_reason: 'null | string',
        },
        {
          name: '신청자 이름',
          age: '신청자 나이',
          sex: '신청자 성별',
          region: '신청자 지역',
          phone_number: '신청자 번호',
          write_date: '2023-05-01 17:36:02',
          visit_date: '2023-06-30',
          reason: '방문 신청 합니다.',
          state: 'COMPLETED',
          rehect_reason: 'null | string',
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
  async getReservatino(@Query('account') account: string, @Request() req) {
    const userId = req.user.user_id;
    if (account == 'user') {
      return await this.reservationService.getUserReservation(userId);
    } else if (account == 'orphanage') {
      return await this.reservationService.getOrphanReservation(userId);
    }
  }

  @Patch()
  @ApiOperation({
    summary: '예약 승인/거절',
    description:
      '보육원 계정은 신청 받은 예약을 승인 또는 거절합니다.\
        \n"state"의 값에 따라 승인(approve), 거절(reject)로 예약의 상태가 갱신됩니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`orphanage's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  async changeReservationState(@Body() changeDto: changeReservationDto) {
    await this.reservationService.changeReservationState(changeDto);
  }
}
