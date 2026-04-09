import { ConfigService } from '@nestjs/config';
import { RecipeSuggestionDto } from './dto/recipe-suggestion.dto';
import { AiRecipeResponse } from './types/recipe.types';
export declare class RecipesService {
    private readonly configService;
    private readonly ai;
    constructor(configService: ConfigService);
    private readonly systemPrompt;
    private buildUserPrompt;
    getSuggestions(dto: RecipeSuggestionDto): Promise<AiRecipeResponse>;
}
