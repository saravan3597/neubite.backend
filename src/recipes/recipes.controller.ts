import { Body, Controller, Post } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipeSuggestionDto } from './dto/recipe-suggestion.dto';
import { AiRecipeResponse } from './types/recipe.types';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post('suggestions')
  getSuggestions(@Body() dto: RecipeSuggestionDto): Promise<AiRecipeResponse> {
    return this.recipesService.getSuggestions(dto);
  }
}
