import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
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
  private readonly logger = new Logger(RecipesService.name);
  private readonly ai: OpenAI;

  // Faster/newer models (e.g. gpt-4o-mini, gpt-5-nano) yield significantly
  // better structured JSON output and lower latency than gpt-3.5-turbo.
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GPT_API_KEY');
    this.model = this.configService.get<string>('GPT_MODEL') ?? 'gpt-5-nano';
    this.ai = new OpenAI({ apiKey, timeout: 30_000, maxRetries: 1 });
  }

  private readonly systemPrompt = `
You are a professional chef and nutritionist who specialises in Indian cuisine.
Lean towards Indian recipes whenever the pantry ingredients allow it; suggest other cuisines only when the ingredients clearly don't suit Indian cooking.

Return exactly 3 recipes as a JSON object matching this schema — no extra keys, no markdown:
{
  "recipes": [{
    "id": string,           // short unique alphanumeric e.g. "r1a2b3"
    "title": string,
    "description": string,  // 1-2 appetising sentences
    "timeToCook": number,   // total minutes (prep + cook)
    "mealType": "breakfast" | "lunch" | "dinner" | "snack",
    "tags": [string],       // e.g. ["quick", "vegetarian", "high-protein"]
    "nutritionalData": { "calories": number, "protein": number, "carbs": number, "fat": number },
    "ingredients": [{
      "id": string,
      "name": string,
      "quantity": string,         // human-readable e.g. "200 g"
      "inPantry": boolean,
      "quantityToDeduct": number  // numeric amount to deduct in the pantry's own unit; 0 for non-pantry items
    }],
    "instructions": [string]      // 4–8 plain-English steps
  }]
}`.trim();

  private buildUserPrompt(dto: RecipeSuggestionDto): string {
    const { timeOfDay, maxPrepTime, pantryIngredients } = dto;
    const mealHint = MEAL_TYPE_HINTS[timeOfDay];
    const pantryList = pantryIngredients
      .map((p) => `${p.name} (${p.quantity} ${p.unit})`)
      .join(', ');

    return `
Time of day: ${timeOfDay} (${mealHint})
Max total time: ${maxPrepTime} minutes
Pantry: ${pantryList}

Constraints:
- All 3 recipes must finish within ${maxPrepTime} minutes. Vary effort: one quick (~${Math.round(maxPrepTime / 3)} min), one medium, one near the limit.
- mealType must suit the time of day: morning→breakfast/snack, afternoon→lunch/snack, evening→dinner/lunch, night→snack/dinner.
- Maximise use of pantry items. Set inPantry true for any ingredient matching the pantry (case-insensitive). For each inPantry ingredient set quantityToDeduct in the same unit the pantry uses (e.g. pantry has rice in kgs, recipe needs 200 g → quantityToDeduct: 0.2). Set quantityToDeduct: 0 for non-pantry ingredients.
- Nutritional values must be realistic per-serving estimates.`.trim();
  }

  async getSuggestions(dto: RecipeSuggestionDto): Promise<AiRecipeResponse> {
    const userPrompt = this.buildUserPrompt(dto);

    let rawText: string;
    try {
      const response = await this.ai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2500,
      });
      rawText = response.choices[0]?.message?.content ?? '';
    } catch (error) {
      this.logger.error(
        'OpenAI API error',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        `OpenAI API call failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    let parsed: AiRecipeResponse;
    try {
      parsed = JSON.parse(rawText) as AiRecipeResponse;
    } catch {
      this.logger.error('Failed to parse OpenAI response');
      throw new InternalServerErrorException(
        'OpenAI returned a response that could not be parsed as JSON.',
      );
    }

    if (!Array.isArray(parsed.recipes)) {
      throw new InternalServerErrorException(
        'OpenAI response is missing the "recipes" array.',
      );
    }

    return parsed;
  }
}
