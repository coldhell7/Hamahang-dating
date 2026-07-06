import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LikesService } from './likes.service';

@ApiTags('لایک‌ها (Likes)')
@Controller('likes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'لایک کردن یک کاربر' })
  async like(@Req() req: any, @Param('userId') userId: string) {
    return this.likesService.like(req.user.id, userId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'حذف لایک یک کاربر' })
  async unlike(@Req() req: any, @Param('userId') userId: string) {
    await this.likesService.unlike(req.user.id, userId);
    return { message: 'لایک با موفقیت حذف شد.' };
  }

  @Get('received')
  @ApiOperation({ summary: 'کاربرانی که من را لایک کرده‌اند' })
  async getReceived(@Req() req: any) {
    return this.likesService.getReceivedLikes(req.user.id);
  }

  @Get('sent')
  @ApiOperation({ summary: 'کاربرانی که من لایک کرده‌ام' })
  async getSent(@Req() req: any) {
    return this.likesService.getSentLikes(req.user.id);
  }
}
