import { IsArray, IsEnum, IsNumber, IsString, Max, MaxLength, Min, ValidateNested, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export class PantryIngredientDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @MaxLength(20)
  unit: string;
}

export class RecipeSuggestionDto {
  @IsEnum(['morning', 'afternoon', 'evening', 'night'])
  timeOfDay: TimeOfDay;

  @IsNumber()
  @Min(5)
  @Max(720)
  maxPrepTime: number;

  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => PantryIngredientDto)
  pantryIngredients: PantryIngredientDto[];
}
