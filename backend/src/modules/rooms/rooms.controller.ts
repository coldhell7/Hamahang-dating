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
import { RoomsService } from './rooms.service';

@ApiTags('اتاق‌ها (Rooms)')
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'دریافت لیست اتاق‌های عمومی' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'فیلتر بر اساس دسته‌بندی' })
  async findAll(@Query('categoryId') categoryId?: string) {
    return this.roomsService.findAll(categoryId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ایجاد اتاق جدید' })
  async create(@Body() body: { title: string; categoryId?: string; isPublic?: boolean; coverUrl?: string }, @Req() req: any) {
    return this.roomsService.create(body, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات اتاق' })
  async findById(@Param('id') id: string) {
    return this.roomsService.findById(id);
  }

  @Post(':id/join')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'پیوستن به اتاق' })
  async join(@Param('id') id: string, @Req() req: any) {
    return this.roomsService.join(id, req.user.id);
  }

  @Post(':id/leave')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ترک اتاق' })
  async leave(@Param('id') id: string, @Req() req: any) {
    return this.roomsService.leave(id, req.user.id);
  }

  @Get(':id/messages')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'دریافت پیام‌های اتاق' })
  async getMessages(@Param('id') id: string) {
    return this.roomsService.getMessages(id);
  }

  @Post(':id/messages')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ارسال پیام در اتاق' })
  async sendMessage(
    @Param('id') id: string,
    @Body() body: { text: string },
    @Req() req: any,
  ) {
    return this.roomsService.sendMessage(id, req.user.id, body.text);
  }

  @Get(':id/members')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'دریافت اعضای اتاق' })
  async getMembers(@Param('id') id: string) {
    return this.roomsService.getMembers(id);
  }
}
