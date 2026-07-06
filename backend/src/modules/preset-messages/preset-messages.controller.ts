import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PresetMessagesService } from './preset-messages.service';

@ApiTags('پیام‌های از پیش تعیین شده (Preset Messages)')
@Controller('preset-messages')
export class PresetMessagesController {
  constructor(
    private presetMessagesService: PresetMessagesService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'پیام‌های از پیش تعیین شده من' })
  async findMyMessages(@Req() req: any) {
    return this.presetMessagesService.findMyMessages(req.user.id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ایجاد پیام از پیش تعیین شده جدید (حداکثر ۵ عدد)' })
  async create(
    @Req() req: any,
    @Body() body: { text: string; sortOrder?: number },
  ) {
    return this.presetMessagesService.create(
      req.user.id,
      body.text,
      body.sortOrder,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'بروزرسانی پیام از پیش تعیین شده' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { text?: string; sortOrder?: number },
  ) {
    return this.presetMessagesService.update(
      req.user.id,
      id,
      body.text,
      body.sortOrder,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'حذف پیام از پیش تعیین شده' })
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.presetMessagesService.remove(req.user.id, id);
  }

  @Post(':id/send/:roomId/:targetUserId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ارسال پیام از پیش تعیین شده به کاربر در اتاق' })
  async send(
    @Req() req: any,
    @Param('id') id: string,
    @Param('roomId') roomId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.presetMessagesService.send(
      req.user.id,
      id,
      roomId,
      targetUserId,
    );
  }
}
