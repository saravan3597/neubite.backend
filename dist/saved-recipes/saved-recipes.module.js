"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedRecipesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const saved_recipe_entity_1 = require("./entities/saved-recipe.entity");
const saved_recipes_service_1 = require("./saved-recipes.service");
const saved_recipes_controller_1 = require("./saved-recipes.controller");
let SavedRecipesModule = class SavedRecipesModule {
};
exports.SavedRecipesModule = SavedRecipesModule;
exports.SavedRecipesModule = SavedRecipesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([saved_recipe_entity_1.SavedRecipeEntity])],
        controllers: [saved_recipes_controller_1.SavedRecipesController],
        providers: [saved_recipes_service_1.SavedRecipesService],
    })
], SavedRecipesModule);
//# sourceMappingURL=saved-recipes.module.js.map