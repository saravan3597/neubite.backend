import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('grocery_items')
export class GroceryItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  isPurchased: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
