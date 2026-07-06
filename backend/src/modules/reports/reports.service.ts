import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async createReport(reporterUserId: string, data: { reportedUserId: string; reason: string; description?: string; contextSnapshot?: any }): Promise<Report> {
    const report = this.reportRepository.create({
      reporterUserId,
      reportedUserId: data.reportedUserId,
      reason: data.reason as any,
      description: data.description,
      contextSnapshot: data.contextSnapshot || null,
    });
    return this.reportRepository.save(report);
  }

  async getPendingReports(): Promise<Report[]> {
    return this.reportRepository.find({
      where: { status: ReportStatus.PENDING },
      relations: ['reporter', 'reported'],
      order: { createdAt: 'DESC' },
    });
  }
}
