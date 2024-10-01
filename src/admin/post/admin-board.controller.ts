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

@Controller('admin/board')
@UseGuards(AuthGuard('access'), RolesGuard)
@ApiTags('ADMIN: 관리자 게시글 관리')
export class AdminBoardController {
  constructor(private readonly adminBoardService: AdminBoardService) {}
  @Get('/request')
  @Roles('admin')
  @ApiOperation({
    summary: '관리자 보육원 물품 요청글 전체 조회',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 요청 목록을 반환합니다.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          request_id: {
            type: 'integer',
            example: 1,
            description: '요청의 고유 ID',
          },
          count: {
            type: 'integer',
            example: 5,
            description: '요청된 수량',
          },
          supported_count: {
            type: 'integer',
            example: 0,
            description: '지원된 수량',
          },
          state: {
            type: 'string',
            example: 'REQUESTED',
            description: '현재 요청 상태',
          },
          message: {
            type: 'string',
            example: '내가 좋아하는 속촉한 초코파이',
            description: '요청에 대한 메시지 또는 설명',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  async getAllRequest(): Promise<Request[]> {
    return await this.adminBoardService.findAllRequest();
  }

  @Get('/request/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '관리자 보육원 특정 물품 요청글  조회',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 요청 목록을 반환합니다.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          request_id: {
            type: 'integer',
            example: 1,
            description: '요청의 고유 ID',
          },
          count: {
            type: 'integer',
            example: 5,
            description: '요청된 수량',
          },
          supported_count: {
            type: 'integer',
            example: 0,
            description: '지원된 수량',
          },
          state: {
            type: 'string',
            example: 'REQUESTED',
            description: '현재 요청 상태',
          },
          message: {
            type: 'string',
            example: '내가 좋아하는 속촉한 초코파이',
            description: '요청에 대한 메시지 또는 설명',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당하는 요청글이 없습니다.',
  })
  async getOneRequest(@Param('id') requestId: number): Promise<Request> {
    return await this.adminBoardService.findRequestById(requestId);
  }

  @ApiOperation({
    summary: '관리자 보육원 특정 물품 요청글 삭제',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'ok',
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당하는 요청글이 없습니다.',
  })
  @Delete('/request/:id')
  @Roles('admin')
  async deleteRequest(@Param('id') requestId: number): Promise<void> {
    return await this.adminBoardService.deleteRequestById(requestId);
  }

  @Get('/post')
  @Roles('admin')
  @ApiOperation({
    summary: '관리자 보육원 인증글 전체 조회',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 리뷰 게시글 목록을 반환합니다.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          review_id: {
            type: 'integer',
            example: 1,
            description: '리뷰 게시글의 고유 ID',
          },
          title: {
            type: 'string',
            example: '감사합니다!',
            description: '리뷰 게시글의 제목',
          },
          content: {
            type: 'string',
            example: '잘 먹었습니다~!',
            description: '리뷰 게시글의 내용',
          },
          photo: {
            type: 'string',
            example: 'https://example.com/photo.jpg',
            description: '리뷰 게시글에 포함된 사진의 URL',
          },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2024-09-30 01:44:07',
            description: '리뷰 게시글이 작성된 날짜 및 시간',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  async getAllPost(): Promise<Review[]> {
    return await this.adminBoardService.findAllPost();
  }

  @Get('/post/:id')
  @Roles('admin')
  @ApiOperation({
    summary: '관리자 보육원 특정 인증글 아이디를 통해 조회',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 리뷰 게시글 목록을 반환합니다.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          review_id: {
            type: 'integer',
            example: 1,
            description: '리뷰 게시글의 고유 ID',
          },
          title: {
            type: 'string',
            example: '감사합니다!',
            description: '리뷰 게시글의 제목',
          },
          content: {
            type: 'string',
            example: '잘 먹었습니다~!',
            description: '리뷰 게시글의 내용',
          },
          photo: {
            type: 'string',
            example: 'https://example.com/photo.jpg',
            description: '리뷰 게시글에 포함된 사진의 URL',
          },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2024-09-30 01:44:07',
            description: '리뷰 게시글이 작성된 날짜 및 시간',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 리뷰 게시글 목록을 반환합니다.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          review_id: {
            type: 'integer',
            example: 1,
            description: '리뷰 게시글의 고유 ID',
          },
          title: {
            type: 'string',
            example: '감사합니다!',
            description: '리뷰 게시글의 제목',
          },
          content: {
            type: 'string',
            example: '잘 먹었습니다~!',
            description: '리뷰 게시글의 내용',
          },
          photo: {
            type: 'string',
            example: 'https://example.com/photo.jpg',
            description: '리뷰 게시글에 포함된 사진의 URL',
          },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2024-09-30 01:44:07',
            description: '리뷰 게시글이 작성된 날짜 및 시간',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  async getOnePost(@Param('id') postId: number): Promise<Review> {
    return await this.adminBoardService.findPostById(postId);
  }

  @Get('/post')
  @ApiOperation({
    summary: '관리자 보육원 특정 인증글 제목 검색',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'ok',
  })
  @ApiResponse({
    status: 401,
    description: 'Unaothorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당하는 보육원이 존재하지 않습니다.',
  })
  @Roles('admin')
  async searchReviewsByTitle(@Query('title') title: string): Promise<Review[]> {
    return await this.adminBoardService.findPostByTitle(title);
  }

  @ApiOperation({
    summary: '관리자 보육원 인증글 삭제',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'ok',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당하는 인증글이 없습니다.',
  })
  @Delete('/post/:id')
  @Roles('admin')
  async deletePost(@Param('id') postId: number) {
    return await this.adminBoardService.deletePostById(postId);
  }

  @ApiOperation({
    summary: '관리자 유저 방문 요청글 전체 조회',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 고아원 방문 신청 데이터를 반환합니다.',
    schema: {
      type: 'object',
      properties: {
        orphanage_id: {
          type: 'integer',
          example: 1,
          description: '고아원의 고유 ID',
        },
        visit_date: {
          type: 'string',
          format: 'date',
          example: '2023-12-25',
          description: '방문 신청 날짜',
        },
        reason: {
          type: 'string',
          example: '방문 신청해요~',
          description: '방문 신청 이유',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당하는 방문 요청글이 없습니다.',
  })
  @Get('/reservation')
  async getAllReservation(): Promise<Reservation[]> {
    return await this.adminBoardService.findAllVisit();
  }

  @Get('/reservation/:id')
  @ApiOperation({
    summary: '관리자 유저 방문 요청글 조회',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 고아원 방문 신청 데이터를 반환합니다.',
    schema: {
      type: 'object',
      properties: {
        orphanage_id: {
          type: 'integer',
          example: 1,
          description: '고아원의 고유 ID',
        },
        visit_date: {
          type: 'string',
          format: 'date',
          example: '2023-12-25',
          description: '방문 신청 날짜',
        },
        reason: {
          type: 'string',
          example: '방문 신청해요~',
          description: '방문 신청 이유',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당하는 방문 요청글이 없습니다.',
  })
  @Roles('admin')
  async getOneReservation(
    @Param('id') reservationId: number,
  ): Promise<Reservation> {
    return await this.adminBoardService.findVisitById(reservationId);
  }

  @Delete('/reservation/:id')
  @ApiOperation({
    summary: '관리자 유저 방문 요청글 삭제',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'ok',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당하는 방문 요청글이 없습니다.',
  })
  @Roles('admin')
  async deleteReservation(@Param('id') reservationId: number): Promise<void> {
    return await this.adminBoardService.deleteVisitById(reservationId);
  }
}
