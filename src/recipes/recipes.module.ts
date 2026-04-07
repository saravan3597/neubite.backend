import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [ConfigModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
