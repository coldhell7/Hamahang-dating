import { Controller, Get, Put, Body, UseGuards, Req, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('کاربران (Users)')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'دریافت پروفایل کاربر جاری' })
  async getProfile(@Req() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'بروزرسانی پروفایل کاربر' })
  async updateProfile(@Req() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @Put('onboarding')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'تکمیل مراحل onboarding' })
  async completeOnboarding(@Req() req: any, @Body() body: { name: string; gender: string; city: string; birthYear: number }) {
    return this.usersService.completeOnboarding(req.user.id, body);
  }

  @Get('search')
  @ApiOperation({ summary: 'جستجوی کاربران' })
  async searchUsers(@Param('q') query: string) {
    return this.usersService.searchUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت پروفایل کاربر با آیدی' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
