import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AccountStatus } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('کاربر یافت نشد.');
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, data);
    return this.findById(userId);
  }

  async completeOnboarding(userId: string, data: {
    name: string;
    gender: string;
    city: string;
    birthYear: number;
  }): Promise<User> {
    await this.userRepository.update(userId, {
      ...data,
      onboardingCompleted: true,
    });
    return this.findById(userId);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    return this.updateProfile(userId, { avatarUrl } as User);
  }

  async searchUsers(query: string, limit = 20): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.name ILIKE :query', { query: `%${query}%` })
      .orWhere('user.city ILIKE :query', { query: `%${query}%` })
      .andWhere('user.accountStatus = :status', { status: AccountStatus.ACTIVE })
      .andWhere('user.isSample = :isSample', { isSample: false })
      .limit(limit)
      .getMany();
  }

  async setPremiumStatus(userId: string, isPremium: boolean, expiresAt?: Date): Promise<void> {
    await this.userRepository.update(userId, {
      isPremium,
      premiumExpiresAt: expiresAt || undefined,
    });
  }

  async updateAccountStatus(userId: string, status: AccountStatus): Promise<void> {
    await this.userRepository.update(userId, { accountStatus: status });
  }

  async getSampleCharacters(): Promise<User[]> {
    return this.userRepository.find({
      where: { isSample: true, accountStatus: AccountStatus.ACTIVE },
    });
  }

  async getStats(): Promise<{ totalUsers: number; activeUsers: number; premiumUsers: number }> {
    const [totalUsers, activeUsers, premiumUsers] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { accountStatus: AccountStatus.ACTIVE } }),
      this.userRepository.count({ where: { isPremium: true } }),
    ]);
    return { totalUsers, activeUsers, premiumUsers };
  }
}
