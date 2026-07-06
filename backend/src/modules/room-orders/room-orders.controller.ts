import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoomOrdersService } from './room-orders.service';

@ApiTags('سفارش روم اختصاصی (Room Orders)')
@Controller('room-orders')
export class RoomOrdersController {
  constructor(private roomOrdersService: RoomOrdersService) {}

  @Get('plans')
  @ApiOperation({ summary: 'لیست پلن‌های قیمتی روم' })
  async getPlans() {
    return this.roomOrdersService.getPlans();
  }

  @Get('plans/:id')
  @ApiOperation({ summary: 'جزئیات پلن قیمتی روم' })
  async getPlan(@Param('id') id: string) {
    return this.roomOrdersService.getPlanById(id);
  }

  @Post('orders')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ثبت سفارش روم اختصاصی' })
  async createOrder(
    @Req() req: any,
    @Body() body: { planId: string; purchaseToken: string },
  ) {
    return this.roomOrdersService.createOrder(req.user.id, body.planId, body.purchaseToken);
  }

  @Get('orders')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'لیست سفارش‌های روم من' })
  async getUserOrders(@Req() req: any) {
    return this.roomOrdersService.getUserOrders(req.user.id);
  }

  @Post('orders/:id/verify')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'تایید سفارش روم (پس از پرداخت)' })
  async verifyOrder(@Param('id') id: string) {
    return this.roomOrdersService.verifyOrder(id);
  }
}
