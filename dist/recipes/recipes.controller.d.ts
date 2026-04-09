import { RecipesService } from './recipes.service';
import { RecipeSuggestionDto } from './dto/recipe-suggestion.dto';
import { AiRecipeResponse } from './types/recipe.types';
export declare class RecipesController {
    private readonly recipesService;
    constructor(recipesService: RecipesService);
    getSuggestions(dto: RecipeSuggestionDto): Promise<AiRecipeResponse>;
}
