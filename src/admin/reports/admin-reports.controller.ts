import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { AdminReportsService } from './admin-reports.service';
import { Report } from 'src/entities/report.entity';

@Controller('admin/reports')
@ApiTags('ADMIN: 관리자 기능')
@UseGuards(AuthGuard('access'), RolesGuard)
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @Get()
  @ApiOperation({ summary: '모든 신고 조회' })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      example: [
        {
          report_id: '신고 ID',
          description: '이 유저가 너무 불쾌하게 행동했어요',
          reporter_id: '신고자 ID',
          reporter_name: '아자핑',
          reporter_type: 'USER',
          target_id: '피신고자 ID',
          target_name: '앙대핑',
          target_type: 'USER',
          board_id: null,
          board_name: null,
          board_type: null,
        },
        {
          report_id: '신고 ID',
          description: '이 요청글이 너무 많은 물품을 요청했어요.',
          reporter_id: '신고자 ID',
          reporter_name: '꼼딱핑',
          reporter_type: 'USER',
          target_id: null,
          target_name: null,
          target_type: null,
          board_id: '게시글 ID',
          board_title: '다조핑의 보육원으로 초코파이 5000개 기부해주세요.',
          board_type: 'REQUEST',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Roles('admin')
  async getAllReports(): Promise<Report[]> {
    return this.adminReportsService.getAllReports();
  }

  @Get('/id')
  @ApiOperation({ summary: '특정 신고 ID 조회' })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      example: {
        report_id: '신고 ID',
        description: '이 유저가 너무 불쾌하게 행동했어요',
        reporter_id: '신고자 ID',
        reporter_name: '아자핑',
        reporter_type: 'USER',
        target_id: '피신고자 ID',
        target_name: '앙대핑',
        target_type: 'USER',
        board_id: null,
        board_name: null,
        board_type: null,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Roles('admin')
  async getReportById(@Query('id') reportId: string): Promise<Report> {
    return this.adminReportsService.getReportById(reportId);
  }

  @Get('/desc')
  @ApiOperation({ summary: '특정 신고 description 조회' })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      example: [
        {
          report_id: '신고 ID',
          description: '이 유저가 너무 불쾌하게 행동했어요',
          reporter_id: '신고자 ID',
          reporter_name: '아자핑',
          reporter_type: 'USER',
          target_id: '피신고자 ID',
          target_name: '앙대핑',
          target_type: 'USER',
          board_type: 'CHAT',
          board_content: 'ㄲㅈ',
        },
        {
          report_id: '신고 ID',
          description: 'ㅇ',
          reporter_id: '신고자 ID',
          reporter_name: '꼼딱핑',
          reporter_type: 'USER',
          target_id: null,
          target_name: null,
          target_type: null,
          board_id: '게시글 ID',
          board_title: '다조핑의 보육원으로 초코파이 5000개 기부해주세요.',
          board_type: 'ORPHANAGE',
          board_content: 'sdfsdfdsdssdsdfdsf',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Roles('admin')
  async getReportsByDescription(
    @Query('desc') description: string,
  ): Promise<Report[]> {
    return this.adminReportsService.getReportsByDescription(description);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '특정 신고 ID 삭제' })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`}",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 신고입니다.',
  })
  @Roles('admin')
  async deleteReport(@Param('id') reportId: string) {
    return this.adminReportsService.deleteReport(reportId);
  }
}
