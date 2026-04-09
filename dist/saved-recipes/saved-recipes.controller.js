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
exports.SavedRecipesController = void 0;
const common_1 = require("@nestjs/common");
const saved_recipes_service_1 = require("./saved-recipes.service");
const save_recipe_dto_1 = require("./dto/save-recipe.dto");
let SavedRecipesController = class SavedRecipesController {
    savedRecipesService;
    constructor(savedRecipesService) {
        this.savedRecipesService = savedRecipesService;
    }
    findAll() {
        return this.savedRecipesService.findAll();
    }
    save(dto) {
        return this.savedRecipesService.save(dto);
    }
    remove(recipeId) {
        return this.savedRecipesService.remove(recipeId);
    }
};
exports.SavedRecipesController = SavedRecipesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SavedRecipesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_recipe_dto_1.SaveRecipeDto]),
    __metadata("design:returntype", void 0)
], SavedRecipesController.prototype, "save", null);
__decorate([
    (0, common_1.Delete)(':recipeId'),
    __param(0, (0, common_1.Param)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SavedRecipesController.prototype, "remove", null);
exports.SavedRecipesController = SavedRecipesController = __decorate([
    (0, common_1.Controller)('saved-recipes'),
    __metadata("design:paramtypes", [saved_recipes_service_1.SavedRecipesService])
], SavedRecipesController);
//# sourceMappingURL=saved-recipes.controller.js.map