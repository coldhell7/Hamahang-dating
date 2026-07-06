import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../../modules/rooms/room.entity';
import { User } from '../../modules/users/user.entity';
import { StickerType } from './sticker-type.entity';

@Entity('sticker_gift_transactions')
export class StickerGiftTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  fromUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @Column()
  toUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @Column()
  stickerTypeId: string;

  @ManyToOne(() => StickerType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stickerTypeId' })
  stickerType: StickerType;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
