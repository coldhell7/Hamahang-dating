import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FeatureFlagsService } from './feature-flags.service';

@ApiTags('قابلیت‌ها (Feature Flags)')
@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private featureFlagsService: FeatureFlagsService) {}

  @Get()
  @ApiOperation({ summary: 'لیست تمام قابلیت‌ها' })
  async getAll() {
    return this.featureFlagsService.getAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'بررسی وضعیت یک قابلیت' })
  async getByKey(@Param('key') key: string) {
    return this.featureFlagsService.getByKey(key);
  }

  @Post(':key/toggle')
  @ApiOperation({ summary: 'تغییر وضعیت یک قابلیت' })
  async toggle(@Param('key') key: string) {
    return this.featureFlagsService.toggle(key);
  }
}
