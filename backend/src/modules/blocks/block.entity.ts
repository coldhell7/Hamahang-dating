import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../modules/users/user.entity';

@Entity('blocks')
@Unique(['blockerUserId', 'blockedUserId'])
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  blockerUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockerUserId' })
  blocker: User;

  @Column()
  blockedUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockedUserId' })
  blocked: User;

  @CreateDateColumn()
  createdAt: Date;
}
