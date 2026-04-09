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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeSuggestionDto = exports.PantryIngredientDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PantryIngredientDto {
    name;
    quantity;
    unit;
}
exports.PantryIngredientDto = PantryIngredientDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PantryIngredientDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PantryIngredientDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PantryIngredientDto.prototype, "unit", void 0);
class RecipeSuggestionDto {
    timeOfDay;
    maxPrepTime;
    pantryIngredients;
}
exports.RecipeSuggestionDto = RecipeSuggestionDto;
__decorate([
    (0, class_validator_1.IsEnum)(['morning', 'afternoon', 'evening', 'night']),
    __metadata("design:type", String)
], RecipeSuggestionDto.prototype, "timeOfDay", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(5),
    __metadata("design:type", Number)
], RecipeSuggestionDto.prototype, "maxPrepTime", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PantryIngredientDto),
    __metadata("design:type", Array)
], RecipeSuggestionDto.prototype, "pantryIngredients", void 0);
//# sourceMappingURL=recipe-suggestion.dto.js.map