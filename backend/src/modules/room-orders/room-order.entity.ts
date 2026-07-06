import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { RoomPlan } from './room-plan.entity';
import { Room } from '../../modules/rooms/room.entity';

export enum RoomOrderStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
}

@Entity('room_orders')
export class RoomOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  roomPlanId: string;

  @ManyToOne(() => RoomPlan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomPlanId' })
  roomPlan: RoomPlan;

  @Column({ nullable: true })
  roomId: string;

  @ManyToOne(() => Room, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column({ length: 500 })
  bazaarPurchaseToken: string;

  @Column({
    type: 'enum',
    enum: RoomOrderStatus,
    default: RoomOrderStatus.PENDING,
  })
  status: RoomOrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;
}
