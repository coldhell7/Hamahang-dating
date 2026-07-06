import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sticker_types')
export class StickerType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 500 })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isStarterPackItem: boolean;

  @Column({ type: 'integer', default: 0 })
  defaultStarterQuantity: number;
}
