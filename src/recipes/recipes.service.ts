import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RecipeSuggestionDto, TimeOfDay } from './dto/recipe-suggestion.dto';
import { AiRecipeResponse } from './types/recipe.types';

const MEAL_TYPE_HINTS: Record<TimeOfDay, string> = {
  morning: 'breakfast or a light morning snack',
  afternoon: 'lunch or an afternoon snack',
  evening: 'dinner or a hearty evening meal',
  night: 'a light late-night snack or quick dinner',
};

@Injectable()
export class RecipesService {
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private buildPrompt(dto: RecipeSuggestionDto): string {
    const { timeOfDay, maxPrepTime, pantryIngredients } = dto;

    const pantryList =
      pantryIngredients.length > 0
        ? pantryIngredients.join(', ')
        : 'none specified — suggest anything suitable for the time of day';

    const mealHint = MEAL_TYPE_HINTS[timeOfDay];

    return `
You are a professional chef and nutritionist. Suggest exactly 3 distinct recipes tailored to the context below.

Context:
- Time of day: ${timeOfDay} → ideal for ${mealHint}
- Maximum total time (prep + cook): ${maxPrepTime} minutes
- Available pantry ingredients: ${pantryList}

Rules:
1. Every recipe must be completable within ${maxPrepTime} minutes total.
2. Vary the effort: one quick (roughly one-third of the max time), one medium, one closer to the limit.
3. Prioritise recipes that use the listed pantry ingredients. Set "inPantry": true for any ingredient that matches the pantry list (case-insensitive); false for anything extra the user would need to buy.
4. Choose a mealType appropriate for the time of day: morning → breakfast or snack, afternoon → lunch or snack, evening → dinner or lunch, night → snack or dinner.
5. Write 4–8 clear, numbered cooking instructions per recipe as an array of plain-English step strings.
6. Nutritional values (calories, protein, carbs, fat) must be realistic per-serving estimates in grams/kcal.
7. Generate a short unique alphanumeric string (e.g. "r1a2b3") for each recipe "id" and each ingredient "id".
8. Tags should be short descriptors (e.g. "quick", "vegetarian", "high-protein", "gluten-free").

IMPORTANT: Respond with ONLY a raw JSON object. No markdown, no code fences, no explanation text — just the JSON.

Required schema:
{
  "recipes": [
    {
      "id": "string",
      "title": "string",
      "description": "string (1–2 sentences, appetising and informative)",
      "timeToCook": number,
      "mealType": "breakfast" | "lunch" | "dinner" | "snack",
      "tags": ["string"],
      "nutritionalData": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      },
      "ingredients": [
        {
          "id": "string",
          "name": "string",
          "quantity": "string",
          "inPantry": boolean
        }
      ],
      "instructions": [
        "Step 1: ...",
        "Step 2: ..."
      ]
    }
  ]
}
`.trim();
  }

  async getSuggestions(dto: RecipeSuggestionDto): Promise<AiRecipeResponse> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = this.buildPrompt(dto);

    let rawText: string;
    try {
      const result = await model.generateContent(prompt);
      rawText = result.response.text();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to reach Gemini API. Check your GEMINI_API_KEY and network access.',
      );
    }

    // Strip markdown code fences if the model includes them despite instructions
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim();

    let parsed: AiRecipeResponse;
    try {
      parsed = JSON.parse(cleaned) as AiRecipeResponse;
    } catch {
      throw new InternalServerErrorException(
        'Gemini returned a response that could not be parsed as JSON.',
      );
    }

    if (!Array.isArray(parsed.recipes)) {
      throw new InternalServerErrorException(
        'Gemini response is missing the "recipes" array.',
      );
    }

    return parsed;
  }
}
