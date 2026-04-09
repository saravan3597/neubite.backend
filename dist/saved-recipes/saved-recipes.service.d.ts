import { Repository } from 'typeorm';
import { SavedRecipeEntity } from './entities/saved-recipe.entity';
import { SaveRecipeDto } from './dto/save-recipe.dto';
export declare class SavedRecipesService {
    private readonly repo;
    constructor(repo: Repository<SavedRecipeEntity>);
    findAll(): Promise<Record<string, unknown>[]>;
    save(dto: SaveRecipeDto): Promise<void>;
    remove(recipeId: string): Promise<void>;
}
