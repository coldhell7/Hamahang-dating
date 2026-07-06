import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SponsoredRoomsService } from './sponsored-rooms.service';
import { SponsoredRoomStatus } from './sponsored-room-request.entity';

@ApiTags('روم‌های اسپانسری')
@Controller('sponsored-rooms')
export class SponsoredRoomsController {
  constructor(private sponsoredRoomsService: SponsoredRoomsService) {}

  @Get('requests')
  @ApiOperation({ summary: 'لیست درخواست‌های روم اسپانسری (ادمین)' })
  async getAllRequests() {
    return this.sponsoredRoomsService.getAllRequests();
  }

  @Post('requests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ثبت درخواست روم اسپانسری' })
  async createRequest(@Req() req: any, @Body() body: { brandName: string; goalDescription: string; preferredDate?: string }) {
    return this.sponsoredRoomsService.createRequest(req.user.id, body);
  }
}
