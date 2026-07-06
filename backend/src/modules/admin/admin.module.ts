import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminUser } from './admin-user.entity';
import { User } from '../users/user.entity';
import { Song } from '../songs/song.entity';
import { Room } from '../rooms/room.entity';
import { MusicCategory } from '../categories/category.entity';
import { FeatureFlag } from '../feature-flags/feature-flag.entity';
import { StickerType } from '../stickers/sticker-type.entity';
import { RoomPlan } from '../room-orders/room-plan.entity';
import { Subscription } from '../vip/subscription.entity';
import { Report } from '../reports/report.entity';
import { SponsoredRoomRequest } from '../sponsored-rooms/sponsored-room-request.entity';
import { PresetMessage } from '../preset-messages/preset-message.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminUser, User, Song, Room, MusicCategory,
      FeatureFlag, StickerType, RoomPlan, Subscription,
      Report, SponsoredRoomRequest, PresetMessage,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
