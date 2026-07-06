import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SampleCharactersService } from './sample-characters.service';
import { AdminGuard } from './admin.guard';

@ApiTags('شخصیت‌های نمونه (Sample Characters)')
@Controller('sample-characters')
export class SampleCharactersController {
  constructor(
    private sampleCharactersService: SampleCharactersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'لیست تمام شخصیت‌های نمونه' })
  async findAll() {
    return this.sampleCharactersService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ایجاد شخصیت نمونه (ادمین)' })
  async create(
    @Body()
    body: {
      name: string;
      gender?: string;
      city?: string;
      birthYear?: number;
      avatarUrl?: string;
      bio?: string;
    },
  ) {
    return this.sampleCharactersService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'بروزرسانی شخصیت نمونه (ادمین)' })
  async update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      gender: string;
      city: string;
      birthYear: number;
      avatarUrl: string;
      bio: string;
    }>,
  ) {
    return this.sampleCharactersService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'حذف شخصیت نمونه (ادمین)' })
  async remove(@Param('id') id: string) {
    return this.sampleCharactersService.remove(id);
  }
}
