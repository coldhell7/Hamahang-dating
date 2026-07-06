import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SongsService } from './songs.service';

@ApiTags('آهنگ‌ها (Songs)')
@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Get()
  @ApiOperation({ summary: 'دریافت لیست آهنگ‌ها' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'فیلتر بر اساس دسته‌بندی' })
  @ApiQuery({ name: 'search', required: false, description: 'جستجو بر اساس عنوان' })
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.songsService.findAll(categoryId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات آهنگ' })
  async findById(@Param('id') id: string) {
    return this.songsService.findById(id);
  }

  @Post(':id/play')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'افزایش تعداد پخش آهنگ' })
  async incrementPlayCount(@Param('id') id: string) {
    return this.songsService.incrementPlayCount(id);
  }
}
