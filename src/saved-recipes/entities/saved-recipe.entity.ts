import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('saved_recipes')
@Index(['userId', 'recipeId'], { unique: true })
export class SavedRecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column()
  recipeId: string;

  @Column('text')
  data: string;

  @CreateDateColumn()
  createdAt: Date;
}
