import { IsObject, IsString } from 'class-validator';

export class SaveRecipeDto {
  @IsString()
  recipeId: string;

  @IsObject()
  data: Record<string, unknown>;
}
