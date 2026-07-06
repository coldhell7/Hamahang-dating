import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { StickerType } from './sticker-type.entity';

@Entity('user_sticker_wallets')
@Unique(['userId', 'stickerTypeId'])
export class UserStickerWallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  stickerTypeId: string;

  @ManyToOne(() => StickerType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stickerTypeId' })
  stickerType: StickerType;

  @Column({ type: 'integer', default: 0 })
  balance: number;
}
