import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';
import { Song } from '../songs/song.entity';
import { Subscription } from '../vip/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Room, Song, Subscription]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
