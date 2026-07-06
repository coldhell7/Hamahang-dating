import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@ApiTags('احراز هویت (Auth)')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-otp')
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @ApiOperation({ summary: 'ارسال کد تایید به شماره موبایل' })
  async sendOtp(@Body() body: { phone: string }) {
    return this.authService.sendOtp(body.phone);
  }

  @Post('verify-otp')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'تایید کد OTP و ورود/ثبت‌نام' })
  async verifyOtp(
    @Body() body: {
      phone: string;
      code: string;
      name?: string;
      gender?: string;
      city?: string;
      birthYear?: number;
      categoryIds?: string[];
    },
  ) {
    return this.authService.verifyOtp(
      body.phone,
      body.code,
      {
        name: body.name,
        gender: body.gender,
        city: body.city,
        birthYear: body.birthYear,
        categoryIds: body.categoryIds,
      },
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'تجدید توکن دسترسی' })
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'دریافت پروفایل کاربر جاری' })
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
