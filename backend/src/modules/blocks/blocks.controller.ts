import { Controller, Post, Delete, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BlocksService } from './blocks.service';

@ApiTags('بلاک (Blocks)')
@Controller('blocks')
export class BlocksController {
  constructor(private blocksService: BlocksService) {}

  @Post(':userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'بلاک کردن یک کاربر' })
  async blockUser(@Req() req: any, @Param('userId') userId: string) {
    return this.blocksService.blockUser(req.user.id, userId);
  }

  @Delete(':userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'آنبلاک کردن یک کاربر' })
  async unblockUser(@Req() req: any, @Param('userId') userId: string) {
    return this.blocksService.unblockUser(req.user.id, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'لیست کاربران بلاک شده' })
  async getBlockedUsers(@Req() req: any) {
    return this.blocksService.getBlockedUsers(req.user.id);
  }
}
