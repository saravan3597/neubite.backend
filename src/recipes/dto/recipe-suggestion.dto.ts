import { IsArray, IsEnum, IsNumber, IsString, Min } from 'class-validator';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export class RecipeSuggestionDto {
  @IsEnum(['morning', 'afternoon', 'evening', 'night'])
  timeOfDay: TimeOfDay;

  @IsNumber()
  @Min(5)
  maxPrepTime: number;

  @IsArray()
  @IsString({ each: true })
  pantryIngredients: string[];
}
