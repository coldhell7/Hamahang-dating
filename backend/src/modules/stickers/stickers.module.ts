import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StickersController } from './stickers.controller';
import { StickersService } from './stickers.service';
import { StickerType } from './sticker-type.entity';
import { UserStickerWallet } from './user-sticker-wallet.entity';
import { StickerGiftTransaction } from './sticker-gift-transaction.entity';
import { StickerPackProduct } from './sticker-pack-product.entity';
import { StickerPackPurchase } from './sticker-pack-purchase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StickerType,
      UserStickerWallet,
      StickerGiftTransaction,
      StickerPackProduct,
      StickerPackPurchase,
    ]),
  ],
  controllers: [StickersController],
  providers: [StickersService],
  exports: [StickersService],
})
export class StickersModule {}
