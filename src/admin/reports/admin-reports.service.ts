import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async getAllReports(): Promise<Report[]> {
    return await this.reportRepository.createQueryBuilder('report').getMany();
  }

  async getReportById(reportId: string): Promise<Report> {
    const report = await this.reportRepository
      .createQueryBuilder('report')
      .where('report.report_id = :reportId', { reportId })
      .getOne();

    if (!report) {
      throw new NotFoundException('존재하지 않는 신고입니다.');
    }

    return report;
  }

  async getReportsByDescription(description: string): Promise<Report[]> {
    return await this.reportRepository
      .createQueryBuilder('report')
      .where('report.description LIKE :description', {
        description: `%${description}%`,
      })
      .getMany();
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
