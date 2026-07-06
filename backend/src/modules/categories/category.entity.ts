import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('music_categories')
export class MusicCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nameFa: string;

  @Column({ length: 50 })
  type: string; // 'genre' | 'mood' | 'artist'

  @Column({ length: 200, nullable: true })
  icon: string;

  @Column({ default: true })
  isActive: boolean;
}
