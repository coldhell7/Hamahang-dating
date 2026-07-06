import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MusicCategory } from '../categories/category.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200 })
  artistName: string;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => MusicCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: MusicCategory;

  @Column({ length: 500 })
  audioUrl: string;

  @Column({ length: 500, nullable: true })
  coverUrl: string;

  @Column({ type: 'integer', default: 0 })
  durationSeconds: number;

  @Column({ default: 0 })
  playCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  uploadedByAdminId: string;

  @CreateDateColumn()
  createdAt: Date;
}
