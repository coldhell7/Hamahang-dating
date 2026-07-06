import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';

@ApiTags('دسته‌بندی‌ها (Categories)')
@Controller()
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('categories')
  @ApiOperation({ summary: 'دریافت لیست دسته‌بندی‌ها' })
  @ApiQuery({ name: 'type', required: false, description: 'فیلتر بر اساس نوع (genre, mood, artist)' })
  async findAll(@Query('type') type?: string) {
    return this.categoriesService.findAll(type);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'دریافت جزئیات دسته‌بندی' })
  async findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Post('users/categories/preferences')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'تنظیم دسته‌بندی‌های مورد علاقه کاربر' })
  async setPreferences(
    @Body() body: { categoryIds: string[] },
    @Req() req: any,
  ) {
    return this.categoriesService.setUserPreferences(req.user.id, body.categoryIds);
  }

  @Get('users/categories/preferences')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'دریافت دسته‌بندی‌های مورد علاقه کاربر' })
  async getPreferences(@Req() req: any) {
    return this.categoriesService.getUserPreferences(req.user.id);
  }
}
