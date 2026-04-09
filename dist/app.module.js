"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const recipes_module_1 = require("./recipes/recipes.module");
const ingredients_module_1 = require("./ingredients/ingredients.module");
const pantry_module_1 = require("./pantry/pantry.module");
const grocery_module_1 = require("./grocery/grocery.module");
const saved_recipes_module_1 = require("./saved-recipes/saved-recipes.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const dbUrl = configService.get('DATABASE_URL');
                    if (dbUrl) {
                        return {
                            type: 'postgres',
                            url: dbUrl,
                            autoLoadEntities: true,
                            synchronize: process.env.NODE_ENV !== 'production',
                        };
                    }
                    return {
                        type: 'sqlite',
                        database: 'neubite-fallback.sqlite',
                        autoLoadEntities: true,
                        synchronize: true,
                    };
                },
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            recipes_module_1.RecipesModule,
            ingredients_module_1.IngredientsModule,
            pantry_module_1.PantryModule,
            grocery_module_1.GroceryModule,
            saved_recipes_module_1.SavedRecipesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map