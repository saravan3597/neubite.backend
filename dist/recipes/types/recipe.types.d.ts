export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export interface Ingredient {
    id: string;
    name: string;
    quantity: string;
    inPantry: boolean;
}
export interface NutritionalData {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}
export interface Recipe {
    id: string;
    title: string;
    description: string;
    timeToCook: number;
    mealType: MealType;
    tags: string[];
    nutritionalData: NutritionalData;
    ingredients: Ingredient[];
    instructions: string[];
}
export interface AiRecipeResponse {
    recipes: Recipe[];
}
