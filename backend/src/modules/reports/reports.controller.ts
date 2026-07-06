import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';

@ApiTags('گزارش (Reports)')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ثبت گزارش از یک کاربر' })
  async createReport(@Req() req: any, @Body() body: { reportedUserId: string; reason: string; description?: string }) {
    return this.reportsService.createReport(req.user.id, body);
  }

  @Get('pending')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'لیست گزارش‌های در انتظار بررسی' })
  async getPendingReports() {
    return this.reportsService.getPendingReports();
  }
}
