import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VipService } from './vip.service';
import { AdminGuard } from './admin.guard';

@ApiTags('اشتراک ویژه (VIP)')
@Controller('vip')
export class VipController {
  constructor(private vipService: VipService) {}

  @Post('subscribe')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ایجاد اشتراک ویژه پس از خرید از کافه بازار' })
  async subscribe(
    @Req() req: any,
    @Body()
    body: {
      sku: string;
      bazaarPurchaseToken: string;
    },
  ) {
    return this.vipService.subscribe(
      req.user.id,
      body.sku,
      body.bazaarPurchaseToken,
    );
  }

  @Post('verify')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'تایید توکن خرید با کافه بازار' })
  async verify(
    @Req() req: any,
    @Body() body: { token: string },
  ) {
    return this.vipService.verifyPurchase(req.user.id, body.token);
  }

  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'وضعیت اشتراک ویژه کاربر جاری' })
  async getStatus(@Req() req: any) {
    return this.vipService.getStatus(req.user.id);
  }

  @Post('admin/grant')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'اعطای دستی اشتراک ویژه توسط ادمین' })
  async adminGrant(
    @Body() body: { userId: string; durationDays: number },
  ) {
    return this.vipService.adminGrant(body.userId, body.durationDays);
  }
}
