"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
const MEAL_TYPE_HINTS = {
    morning: 'breakfast or a light morning snack',
    afternoon: 'lunch or an afternoon snack',
    evening: 'dinner or a hearty evening meal',
    night: 'a light late-night snack or quick dinner',
};
let RecipesService = class RecipesService {
    configService;
    ai;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.getOrThrow('GPT_API_KEY');
        this.ai = new openai_1.default({ apiKey });
    }
    systemPrompt = `
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
    buildUserPrompt(dto) {
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
    async getSuggestions(dto) {
        const userPrompt = this.buildUserPrompt(dto);
        let rawText;
        try {
            const response = await this.ai.chat.completions.create({
                model: 'gpt-5-nano',
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                response_format: { type: 'json_object' },
            });
            rawText = response.choices[0]?.message?.content ?? '';
        }
        catch (error) {
            console.error('[RecipesService] OpenAI API error:', error);
            throw new common_1.InternalServerErrorException(`OpenAI API call failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        let parsed;
        try {
            parsed = JSON.parse(rawText);
        }
        catch {
            console.error('[RecipesService] Failed to parse OpenAI response:', rawText);
            throw new common_1.InternalServerErrorException('OpenAI returned a response that could not be parsed as JSON.');
        }
        if (!Array.isArray(parsed.recipes)) {
            throw new common_1.InternalServerErrorException('OpenAI response is missing the "recipes" array.');
        }
        return parsed;
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RecipesService);
//# sourceMappingURL=recipes.service.js.map