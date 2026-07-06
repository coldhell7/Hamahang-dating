import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { PresetMessage } from './preset-message.entity';
import { Room } from '../../modules/rooms/room.entity';

@Entity('preset_message_send_logs')
export class PresetMessageSendLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  presetMessageId: string;

  @ManyToOne(() => PresetMessage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'presetMessageId' })
  presetMessage: PresetMessage;

  @Column()
  senderId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column()
  roomId: string;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  targetUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'targetUserId' })
  targetUser: User;

  @CreateDateColumn()
  sentAt: Date;
}
