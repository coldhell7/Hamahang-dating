import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StoriesService } from './stories.service';

@ApiTags('استوری‌ها (Stories)')
@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ایجاد استوری ۳۰ ثانیه‌ای (فقط کاربران ویژه)' })
  async create(
    @Req() req: any,
    @Body() body: { audioUrl: string },
  ) {
    return this.storiesService.create(req.user.id, body.audioUrl);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'دریافت استوری فعال کاربر' })
  async getActiveStory(@Param('userId') userId: string) {
    return this.storiesService.getActiveStory(userId);
  }
}
