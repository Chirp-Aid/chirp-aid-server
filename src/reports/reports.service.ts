import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { DataSource, Repository } from 'typeorm';
import { ReportUserDto } from './dto/report-user.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private dataSource: DataSource,
  ) {}

  async reportUser(reportUserDto: ReportUserDto) {
    const {
      description,
      reporter_id: reporterId,
      reporter_name: reporterName,
      reporter_type: reporterType,
      target_id: targetId,
      target_name: targetName,
      target_type: targetType,
      board_type: boardType,
      board_content: boardContent,
    } = reportUserDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newReport = new Report();
      newReport.description = description;
      newReport.reporter_id = reporterId;
      newReport.reporter_name = reporterName;
      newReport.reporter_type = reporterType;
      newReport.target_id = targetId;
      newReport.target_name = targetName;
      newReport.target_type = targetType;
      newReport.board_content = boardContent;
      newReport.board_type = boardType;

      const report = await queryRunner.manager.save(newReport);
      await queryRunner.commitTransaction();
      console.log(`save Report: ${report.report_id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteReport(reportId: string) {
    const report = await this.reportRepository.findOne({
      where: { report_id: reportId },
    });

    if (!report) {
      throw new NotFoundException('존재하지 않는 신고입니다.');
    }

    return await this.reportRepository.remove(report);
  }
}
