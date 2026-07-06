import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { StickerPackProduct } from './sticker-pack-product.entity';

export enum PurchaseStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
}

@Entity('sticker_pack_purchases')
export class StickerPackPurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  stickerPackProductId: string;

  @ManyToOne(() => StickerPackProduct, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stickerPackProductId' })
  stickerPackProduct: StickerPackProduct;

  @Column({ length: 500 })
  bazaarPurchaseToken: string;

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    default: PurchaseStatus.PENDING,
  })
  status: PurchaseStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;
}
