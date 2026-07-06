import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Subscription, SubscriptionStatus } from './subscription.entity';
import { User } from '../users/user.entity';

@Injectable()
export class VipService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async subscribe(
    userId: string,
    sku: string,
    bazaarPurchaseToken: string,
  ): Promise<Subscription> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد.');
    }

    const durationDays = this.getDurationFromSku(sku);
    if (durationDays <= 0) {
      throw new BadRequestException('SKU نامعتبر است.');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const subscription = this.subscriptionRepository.create({
      userId,
      sku,
      bazaarPurchaseToken,
      status: SubscriptionStatus.ACTIVE,
      expiresAt,
    });

    return this.subscriptionRepository.save(subscription);
  }

  async verifyPurchase(userId: string, token: string): Promise<{ verified: boolean; isPremium: boolean }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد.');
    }

    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, bazaarPurchaseToken: token },
      order: { purchasedAt: 'DESC' },
    });

    if (!subscription) {
      throw new NotFoundException('خرید اشتراک یافت نشد.');
    }

    try {
      // Simulate Cafe Bazaar server-side verification
      const verificationResult = await this.verifyWithCafeBazaar(
        token,
        subscription.sku,
      );

      if (!verificationResult.verified) {
        subscription.status = SubscriptionStatus.CANCELLED;
        await this.subscriptionRepository.save(subscription);
        throw new BadRequestException('تایید خرید توسط کافه بازار ناموفق بود.');
      }

      subscription.verifiedAt = new Date();
      await this.subscriptionRepository.save(subscription);

      // Update user premium status
      user.isPremium = true;
      user.premiumExpiresAt = subscription.expiresAt;
      await this.userRepository.save(user);

      return { verified: true, isPremium: true };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'خطا در ارتباط با سرور کافه بازار.',
      );
    }
  }

  async getStatus(userId: string): Promise<{
    isPremium: boolean;
    premiumExpiresAt: Date | null;
    activeSubscription: Subscription | null;
  }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد.');
    }

    const activeSubscription = await this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      order: { purchasedAt: 'DESC' },
    });

    return {
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,
      activeSubscription,
    };
  }

  async adminGrant(userId: string, durationDays: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد.');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    user.isPremium = true;
    user.premiumExpiresAt = expiresAt;
    await this.userRepository.save(user);

    // Create an admin-granted subscription record
    const subscription = this.subscriptionRepository.create({
      userId,
      sku: 'admin_grant',
      bazaarPurchaseToken: `admin_grant_${Date.now()}`,
      status: SubscriptionStatus.ACTIVE,
      expiresAt,
      verifiedAt: new Date(),
    });
    await this.subscriptionRepository.save(subscription);

    return user;
  }

  private getDurationFromSku(sku: string): number {
    const durationMap: Record<string, number> = {
      'vip_monthly': 30,
      'vip_3months': 90,
      'vip_6months': 180,
      'vip_yearly': 365,
    };
    return durationMap[sku] || 0;
  }

  /**
   * Mock Cafe Bazaar server-side verification.
   * In production, replace with actual HTTP call to Cafe Bazaar API.
   */
  private async verifyWithCafeBazaar(
    purchaseToken: string,
    sku: string,
  ): Promise<{ verified: boolean }> {
    // TODO: Implement actual Cafe Bazaar verification via their REST API
    // Reference: https://developers.cafebazaar.ir/en/docs/verify-api
    return { verified: true };
  }
}
