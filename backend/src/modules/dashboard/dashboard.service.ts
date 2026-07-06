import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AccountStatus } from '../users/user.entity';
import { Room } from '../rooms/room.entity';
import { Song } from '../songs/song.entity';
import { Subscription, SubscriptionStatus } from '../vip/subscription.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Song) private songRepository: Repository<Song>,
    @InjectRepository(Subscription) private subscriptionRepository: Repository<Subscription>,
  ) {}

  async getStats(): Promise<any> {
    const [totalUsers, activeUsers, premiumUsers, totalRooms, liveRooms, totalSongs, activeSubscriptions] = 
      await Promise.all([
        this.userRepository.count(),
        this.userRepository.count({ where: { accountStatus: AccountStatus.ACTIVE } }),
        this.userRepository.count({ where: { isPremium: true } }),
        this.roomRepository.count(),
        this.roomRepository.count({ where: { isLive: true } }),
        this.songRepository.count({ where: { isActive: true } }),
        this.subscriptionRepository.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      ]);

    return {
      totalUsers,
      activeUsers,
      premiumUsers,
      totalRooms,
      liveRooms,
      totalSongs,
      activeSubscriptions,
      premiumRate: totalUsers > 0 ? (premiumUsers / totalUsers * 100).toFixed(1) : 0,
    };
  }
}
