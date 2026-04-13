import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CognitoAuthGuard } from '../auth/guards/cognito-auth.guard';
import { RecipesService } from './recipes.service';
import { RecipeSuggestionDto } from './dto/recipe-suggestion.dto';
import { AiRecipeResponse } from './types/recipe.types';

@Controller('recipes')
@UseGuards(CognitoAuthGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post('suggestions')
  getSuggestions(@Body() dto: RecipeSuggestionDto): Promise<AiRecipeResponse> {
    return this.recipesService.getSuggestions(dto);
  }
}
