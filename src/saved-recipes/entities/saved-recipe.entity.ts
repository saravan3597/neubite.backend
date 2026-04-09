import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('saved_recipes')
export class SavedRecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  recipeId: string;

  @Column('text')
  data: string;

  @CreateDateColumn()
  createdAt: Date;
}
