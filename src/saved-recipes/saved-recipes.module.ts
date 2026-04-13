import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedRecipeEntity } from './entities/saved-recipe.entity';
import { SavedRecipesService } from './saved-recipes.service';
import { SavedRecipesController } from './saved-recipes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SavedRecipeEntity])],
  controllers: [SavedRecipesController],
  providers: [SavedRecipesService],
})
export class SavedRecipesModule {}
