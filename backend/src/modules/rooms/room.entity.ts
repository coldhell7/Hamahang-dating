import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { MusicCategory } from '../categories/category.entity';

export enum RoomStatus {
  LIVE = 'live',
  ENDED = 'ended',
  ARCHIVED = 'archived',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => MusicCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: MusicCategory;

  @Column({ nullable: true })
  ownerUserId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerUserId' })
  owner: User;

  @Column({ default: true })
  isLive: boolean;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  currentSongId: string;

  @Column({ type: 'integer', default: 0 })
  listenerCount: number;

  @Column({ length: 500, nullable: true })
  coverUrl: string;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.LIVE,
  })
  status: RoomStatus;

  @CreateDateColumn()
  createdAt: Date;
}
