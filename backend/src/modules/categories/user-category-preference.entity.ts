import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { MusicCategory } from './category.entity';

@Entity('user_category_preferences')
export class UserCategoryPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  categoryId: string;

  @ManyToOne(() => MusicCategory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: MusicCategory;
}
