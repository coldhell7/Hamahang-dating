import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('room_plans')
export class RoomPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'integer' })
  maxCapacity: number;

  @Column({ type: 'integer' })
  price: number; // in Rials

  @Column({ length: 100, nullable: true })
  sku: string;

  @Column({ default: true })
  isActive: boolean;
}
