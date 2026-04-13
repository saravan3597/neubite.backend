import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CognitoAuthGuard } from '../auth/guards/cognito-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { SavedRecipesService } from './saved-recipes.service';
import { SaveRecipeDto } from './dto/save-recipe.dto';

@Controller('saved-recipes')
@UseGuards(CognitoAuthGuard)
export class SavedRecipesController {
  constructor(private readonly savedRecipesService: SavedRecipesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.savedRecipesService.findAll(user.userId);
  }

  @Post()
  save(@CurrentUser() user: AuthUser, @Body() dto: SaveRecipeDto) {
    return this.savedRecipesService.save(user.userId, dto);
  }

  @Delete(':recipeId')
  remove(@CurrentUser() user: AuthUser, @Param('recipeId') recipeId: string) {
    return this.savedRecipesService.remove(user.userId, recipeId);
  }
}
