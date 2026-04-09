import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SavedRecipesService } from './saved-recipes.service';
import { SaveRecipeDto } from './dto/save-recipe.dto';

@Controller('saved-recipes')
export class SavedRecipesController {
  constructor(private readonly savedRecipesService: SavedRecipesService) {}

  @Get()
  findAll() {
    return this.savedRecipesService.findAll();
  }

  @Post()
  save(@Body() dto: SaveRecipeDto) {
    return this.savedRecipesService.save(dto);
  }

  @Delete(':recipeId')
  remove(@Param('recipeId') recipeId: string) {
    return this.savedRecipesService.remove(recipeId);
  }
}
