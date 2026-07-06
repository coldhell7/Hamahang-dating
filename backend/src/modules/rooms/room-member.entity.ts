import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { Room } from './room.entity';

export enum RoomMemberRole {
  HOST = 'host',
  CO_HOST = 'co-host',
  MODERATOR = 'moderator',
  LISTENER = 'listener',
}

@Entity('room_members')
export class RoomMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({
    type: 'enum',
    enum: RoomMemberRole,
    default: RoomMemberRole.LISTENER,
  })
  role: RoomMemberRole;
}
