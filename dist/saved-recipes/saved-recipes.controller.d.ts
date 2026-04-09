import { SavedRecipesService } from './saved-recipes.service';
import { SaveRecipeDto } from './dto/save-recipe.dto';
export declare class SavedRecipesController {
    private readonly savedRecipesService;
    constructor(savedRecipesService: SavedRecipesService);
    findAll(): Promise<Record<string, unknown>[]>;
    save(dto: SaveRecipeDto): Promise<void>;
    remove(recipeId: string): Promise<void>;
}
