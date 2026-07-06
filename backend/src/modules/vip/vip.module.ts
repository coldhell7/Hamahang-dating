import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { VipController } from './vip.controller';
import { VipService } from './vip.service';
import { Subscription } from './subscription.entity';
import { User } from '../users/user.entity';
import { AdminGuard } from './admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, User]),
    JwtModule,
  ],
  controllers: [VipController],
  providers: [VipService, AdminGuard],
  exports: [VipService],
})
export class VipModule {}
