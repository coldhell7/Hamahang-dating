import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StickerType } from './sticker-type.entity';

@Entity('sticker_pack_products')
export class StickerPackProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column()
  stickerTypeId: string;

  @ManyToOne(() => StickerType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stickerTypeId' })
  stickerType: StickerType;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ length: 100 })
  sku: string;

  @Column({ type: 'integer' })
  price: number; // in Rials

  @Column({ default: true })
  isActive: boolean;
}
