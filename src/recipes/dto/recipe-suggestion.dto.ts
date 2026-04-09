import { IsArray, IsEnum, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export class PantryIngredientDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;
}

export class RecipeSuggestionDto {
  @IsEnum(['morning', 'afternoon', 'evening', 'night'])
  timeOfDay: TimeOfDay;

  @IsNumber()
  @Min(5)
  maxPrepTime: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PantryIngredientDto)
  pantryIngredients: PantryIngredientDto[];
}
