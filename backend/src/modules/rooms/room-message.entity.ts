import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../../modules/rooms/room.entity';
import { User } from '../../modules/users/user.entity';

@Entity('room_messages')
export class RoomMessage {
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

  @Column({ type: 'text' })
  text: string;

  @Column({ default: false })
  isSticker: boolean;

  @Column({ nullable: true })
  stickerTypeId: string;

  @CreateDateColumn()
  createdAt: Date;
}
