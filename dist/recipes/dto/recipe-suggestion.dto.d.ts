export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export declare class PantryIngredientDto {
    name: string;
    quantity: number;
    unit: string;
}
export declare class RecipeSuggestionDto {
    timeOfDay: TimeOfDay;
    maxPrepTime: number;
    pantryIngredients: PantryIngredientDto[];
}
