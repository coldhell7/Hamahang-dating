import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('سلامت (Health)')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'بررسی سلامت سرویس' })
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'hamahang-api',
      version: '1.0.0',
    };
  }
}
