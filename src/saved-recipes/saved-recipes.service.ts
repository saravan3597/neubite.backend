import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedRecipeEntity } from './entities/saved-recipe.entity';
import { SaveRecipeDto } from './dto/save-recipe.dto';

@Injectable()
export class SavedRecipesService {
  constructor(
    @InjectRepository(SavedRecipeEntity)
    private readonly repo: Repository<SavedRecipeEntity>,
  ) {}

  async findAll(): Promise<Record<string, unknown>[]> {
    const rows = await this.repo.find({ order: { createdAt: 'ASC' } });
    return rows.map((r) => JSON.parse(r.data) as Record<string, unknown>);
  }

  async save(dto: SaveRecipeDto): Promise<void> {
    const existing = await this.repo.findOne({ where: { recipeId: dto.recipeId } });
    if (existing) return;
    const entity = this.repo.create({ recipeId: dto.recipeId, data: JSON.stringify(dto.data) });
    await this.repo.save(entity);
  }

  async remove(recipeId: string): Promise<void> {
    await this.repo.delete({ recipeId });
  }
}
