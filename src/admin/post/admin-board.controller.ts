import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'src/entities/request.entity';
import { AdminBoardService } from './admin-board.service';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Review } from 'src/entities/review.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { refreshToken } from 'firebase-admin/app';
import { title } from 'process';

@Controller('admin/board')
@UseGuards(AuthGuard('access'), RolesGuard)
@ApiTags('ADMIN: 관리자 기능')
export class AdminBoardController {
  constructor(private readonly adminBoardService: AdminBoardService) {}

  @Get('/request')
  @Roles('admin')
  @ApiOperation({
    summary: '요청글 목록 전체 가져오기',
    description: '모든 요청글의 정보를 반환합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'array',
      example: [
        {
          request_id: 1,
          count: 5,
          supported_count: 2,
          state: 'REQUESTED',
          message: '초코파이 5개 기부해주세요',
          orphanage_user_id: '다조핑',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAllRequest(): Promise<Request[]> {
    return await this.adminBoardService.findAllRequest();
  }

  @Get('/request/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '특정 요청글 가져오기',
    description: '해당 id 요청글의 정보를 반환합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      example: {
        request_id: 1,
        count: 5,
        supported_count: 2,
        state: 'REQUESTED',
        message: '초코파이 5개 기부해주세요',
        orphanage_user_id: '다조핑',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 요청을 찾을 수 없습니다.',
  })
  async getOneRequest(@Param('id') requestId: number): Promise<Request> {
    return await this.adminBoardService.findRequestById(requestId);
  }

  @Delete('/request/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '특정 요청글 삭제하기',
    description: '해당 id 요청글의 정보를 삭제합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 요청을 찾을 수 없습니다.',
  })
  async deleteRequest(@Param('id') requestId: number): Promise<void> {
    return await this.adminBoardService.deleteRequestById(requestId);
  }

  @Get('/post')
  @Roles('admin')
  @ApiOperation({
    summary: '모든 리뷰글 가져오기',
    description: '모든 요청글의 정보를 반환합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'array',
      example: [
        {
          review_id: 1,
          title: '초코파이 맛있어요',
          content: '초코파이 너무 맛있어요',
          photo: '초코파이 사진url',
          date: '2021-10-10',
          orphanage_user: '다조핑',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAllPost(): Promise<Review[]> {
    return await this.adminBoardService.findAllPost();
  }

  @Get('/post/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '특정 리뷰글 가져오기',
    description: '해당 id 리뷰글의 정보를 반환합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'array',
      example: [
        {
          review_id: 1,
          title: '초코파이 맛있어요',
          content: '초코파이 너무 맛있어요',
          photo: '초코파이 사진url',
          date: '2021-10-10',
          orphanage_user: '다조핑',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 리뷰를 찾을 수 없습니다.',
  })
  async getOnePost(@Param('id') postId: number): Promise<Review> {
    return await this.adminBoardService.findPostById(postId);
  }

  @Get('/post')
  @Roles('admin')
  @ApiOperation({
    summary: '리뷰글 검색하기',
    description: '제목을 검색하여 리뷰글을 반환합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'array',
      example: [
        {
          review_id: 1,
          title: '초코파이 맛있어요',
          content: '초코파이 너무 맛있어요',
          photo: '초코파이 사진url',
          date: '2021-10-10',
          orphanage_user: '다조핑',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async searchReviewsByTitle(@Query('title') title: string): Promise<Review[]> {
    return await this.adminBoardService.findPostByTitle(title);
  }

  @Delete('/post/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '특정 리뷰글 삭제하기',
    description: '해당 id 리뷰글의 정보를 삭제합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 리뷰를 찾을 수 없습니다.',
  })
  async deletePost(@Param('id') postId: number) {
    return await this.adminBoardService.deletePostById(postId);
  }

  @Get('/reservation')
  @Roles('admin')
  @ApiOperation({
    summary: '모든 예약 가져오기',
    description:
      '모든 예약 정보를 반환합니다.\
    state: APPROVED(승인됨), REJECTED(거절됨), PENDING(대기 중), COMPLETED(완료)',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'array',
      example: [
        {
          reservation_id: 1,
          writeDate: '2021-10-10',
          visitDate: '2021-10-15',
          reason: '방문하고 싶어요.',
          state: 'PENDING',
          orphanage_user_id: '다조핑',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAllReservation(): Promise<Reservation[]> {
    return await this.adminBoardService.findAllVisit();
  }

  @Get('/reservation/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '특정 예약 가져오기',
    description:
      '해당 id 예약정보를 반환합니다.\
    state: APPROVED(승인됨), REJECTED(거절됨), PENDING(대기 중), COMPLETED(완료)',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'array',
      example: {
        reservation_id: 1,
        writeDate: '2021-10-10',
        visitDate: '2021-10-15',
        reason: '방문하고 싶어요.',
        state: 'PENDING',
        orphanage_user_id: '다조핑',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 예약을 찾을 수 없습니다.',
  })
  async getOneReservation(
    @Param('id') reservationId: number,
  ): Promise<Reservation> {
    return await this.adminBoardService.findVisitById(reservationId);
  }

  @Delete('/reservation/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '특정 예약글 삭제하기',
    description: '해당 id 예약글의 정보를 삭제합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`admin's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 예약을 찾을 수 없습니다.',
  })
  async deleteReservation(@Param('id') reservationId: number): Promise<void> {
    return await this.adminBoardService.deleteVisitById(reservationId);
  }
}
