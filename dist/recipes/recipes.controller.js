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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesController = void 0;
const common_1 = require("@nestjs/common");
const recipes_service_1 = require("./recipes.service");
const recipe_suggestion_dto_1 = require("./dto/recipe-suggestion.dto");
let RecipesController = class RecipesController {
    recipesService;
    constructor(recipesService) {
        this.recipesService = recipesService;
    }
    getSuggestions(dto) {
        return this.recipesService.getSuggestions(dto);
    }
};
exports.RecipesController = RecipesController;
__decorate([
    (0, common_1.Post)('suggestions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recipe_suggestion_dto_1.RecipeSuggestionDto]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "getSuggestions", null);
exports.RecipesController = RecipesController = __decorate([
    (0, common_1.Controller)('recipes'),
    __metadata("design:paramtypes", [recipes_service_1.RecipesService])
], RecipesController);
//# sourceMappingURL=recipes.controller.js.map