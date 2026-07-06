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
import { StickersService } from './stickers.service';

@ApiTags('استیکرها (Stickers)')
@Controller('stickers')
export class StickersController {
  constructor(private stickersService: StickersService) {}

  @Get('types')
  @ApiOperation({ summary: 'لیست انواع استیکرهای فعال' })
  async getStickerTypes() {
    return this.stickersService.getActiveTypes();
  }

  @Get('wallet')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'کیف پول استیکر کاربر جاری' })
  async getWallet(@Req() req: any) {
    return this.stickersService.getUserWallet(req.user.id);
  }

  @Post('gift')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'اهدای استیکر به یکی از اعضای اتاق' })
  async giftSticker(
    @Req() req: any,
    @Body()
    body: {
      toUserId: string;
      stickerTypeId: string;
      roomId: string;
      quantity?: number;
    },
  ) {
    return this.stickersService.giftSticker(
      req.user.id,
      body.toUserId,
      body.stickerTypeId,
      body.roomId,
      body.quantity,
    );
  }

  @Post('purchase')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ثبت خرید استیکر از کافه بازار' })
  async purchaseSticker(
    @Req() req: any,
    @Body() body: { productSku: string; bazaarPurchaseToken: string },
  ) {
    return this.stickersService.recordPurchase(
      req.user.id,
      body.productSku,
      body.bazaarPurchaseToken,
    );
  }

  @Post('verify-purchase')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'تایید خرید استیکر (سمت سرور)' })
  async verifyPurchase(
    @Req() req: any,
    @Body() body: { purchaseId: string },
  ) {
    return this.stickersService.verifyPurchase(req.user.id, body.purchaseId);
  }
}
