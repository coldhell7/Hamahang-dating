import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StickerType } from './sticker-type.entity';
import { UserStickerWallet } from './user-sticker-wallet.entity';
import { StickerGiftTransaction } from './sticker-gift-transaction.entity';
import { StickerPackProduct } from './sticker-pack-product.entity';
import { StickerPackPurchase, PurchaseStatus } from './sticker-pack-purchase.entity';

@Injectable()
export class StickersService {
  constructor(
    @InjectRepository(StickerType)
    private stickerTypeRepository: Repository<StickerType>,
    @InjectRepository(UserStickerWallet)
    private walletRepository: Repository<UserStickerWallet>,
    @InjectRepository(StickerGiftTransaction)
    private giftTransactionRepository: Repository<StickerGiftTransaction>,
    @InjectRepository(StickerPackProduct)
    private packProductRepository: Repository<StickerPackProduct>,
    @InjectRepository(StickerPackPurchase)
    private purchaseRepository: Repository<StickerPackPurchase>,
  ) {}

  async getActiveTypes(): Promise<StickerType[]> {
    return this.stickerTypeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getUserWallet(userId: string): Promise<UserStickerWallet[]> {
    return this.walletRepository.find({
      where: { userId },
      relations: ['stickerType'],
    });
  }

  async giftSticker(
    fromUserId: string,
    toUserId: string,
    stickerTypeId: string,
    roomId: string,
    quantity: number = 1,
  ): Promise<StickerGiftTransaction> {
    const stickerType = await this.stickerTypeRepository.findOne({
      where: { id: stickerTypeId, isActive: true },
    });
    if (!stickerType) {
      throw new NotFoundException('نوع استیکر یافت نشد.');
    }

    if (quantity <= 0) {
      throw new BadRequestException('تعداد باید بیشتر از صفر باشد.');
    }

    let wallet = await this.walletRepository.findOne({
      where: { userId: fromUserId, stickerTypeId },
    });

    if (!wallet || wallet.balance < quantity) {
      throw new BadRequestException('موجودی کیف پول استیکر کافی نیست.');
    }

    wallet.balance -= quantity;
    await this.walletRepository.save(wallet);

    const transaction = this.giftTransactionRepository.create({
      fromUserId,
      toUserId,
      stickerTypeId,
      roomId,
      quantity,
    });

    return this.giftTransactionRepository.save(transaction);
  }

  async recordPurchase(
    userId: string,
    productSku: string,
    bazaarPurchaseToken: string,
  ): Promise<StickerPackPurchase> {
    const product = await this.packProductRepository.findOne({
      where: { sku: productSku, isActive: true },
    });
    if (!product) {
      throw new NotFoundException('محصول استیکر یافت نشد.');
    }

    const purchase = this.purchaseRepository.create({
      userId,
      stickerPackProductId: product.id,
      bazaarPurchaseToken,
      status: PurchaseStatus.PENDING,
    });

    return this.purchaseRepository.save(purchase);
  }

  async verifyPurchase(userId: string, purchaseId: string): Promise<StickerPackPurchase> {
    const purchase = await this.purchaseRepository.findOne({
      where: { id: purchaseId, userId },
      relations: ['stickerPackProduct'],
    });

    if (!purchase) {
      throw new NotFoundException('خرید یافت نشد.');
    }

    if (purchase.status === PurchaseStatus.VERIFIED) {
      throw new BadRequestException('این خرید قبلاً تایید شده است.');
    }

    try {
      // Simulate Cafe Bazaar server-side verification
      const verificationResult = await this.verifyWithCafeBazaar(
        purchase.bazaarPurchaseToken,
        purchase.stickerPackProduct.sku,
      );

      if (!verificationResult.verified) {
        purchase.status = PurchaseStatus.FAILED;
        await this.purchaseRepository.save(purchase);
        throw new BadRequestException(
          'تایید خرید توسط کافه بازار ناموفق بود.',
        );
      }

      purchase.status = PurchaseStatus.VERIFIED;
      purchase.verifiedAt = new Date();
      await this.purchaseRepository.save(purchase);

      // Add stickers to user's wallet
      await this.addStickersToWallet(
        userId,
        purchase.stickerPackProduct.stickerTypeId,
        purchase.stickerPackProduct.quantity,
      );

      return purchase;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      purchase.status = PurchaseStatus.FAILED;
      await this.purchaseRepository.save(purchase);
      throw new InternalServerErrorException(
        'خطا در ارتباط با سرور کافه بازار.',
      );
    }
  }

  private async addStickersToWallet(
    userId: string,
    stickerTypeId: string,
    quantity: number,
  ): Promise<void> {
    let wallet = await this.walletRepository.findOne({
      where: { userId, stickerTypeId },
    });

    if (!wallet) {
      wallet = this.walletRepository.create({
        userId,
        stickerTypeId,
        balance: 0,
      });
    }

    wallet.balance += quantity;
    await this.walletRepository.save(wallet);
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
