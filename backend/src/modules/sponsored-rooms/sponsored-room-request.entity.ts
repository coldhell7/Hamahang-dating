import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../modules/users/user.entity';

export enum SponsoredRoomStatus {
  NEW = 'new',
  IN_NEGOTIATION = 'in_negotiation',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('sponsored_room_requests')
export class SponsoredRoomRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requestedByUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requestedByUserId' })
  requestedBy: User;

  @Column({ length: 200 })
  brandName: string;

  @Column({ type: 'text' })
  goalDescription: string;

  @Column({ type: 'date', nullable: true })
  preferredDate: Date;

  @Column({
    type: 'enum',
    enum: SponsoredRoomStatus,
    default: SponsoredRoomStatus.NEW,
  })
  status: SponsoredRoomStatus;

  @Column({ nullable: true })
  assignedAdminId: string;

  @CreateDateColumn()
  createdAt: Date;
}
