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
exports.PantryController = void 0;
const common_1 = require("@nestjs/common");
const pantry_service_1 = require("./pantry.service");
const create_pantry_item_dto_1 = require("./dto/create-pantry-item.dto");
const update_pantry_item_dto_1 = require("./dto/update-pantry-item.dto");
let PantryController = class PantryController {
    pantryService;
    constructor(pantryService) {
        this.pantryService = pantryService;
    }
    findAll() {
        return this.pantryService.findAll();
    }
    upsert(dto) {
        return this.pantryService.upsert(dto);
    }
    bulkReplace(body) {
        return this.pantryService.bulkReplace(body.items);
    }
    update(id, dto) {
        return this.pantryService.update(id, dto);
    }
    remove(id) {
        return this.pantryService.remove(id);
    }
};
exports.PantryController = PantryController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PantryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pantry_item_dto_1.CreatePantryItemDto]),
    __metadata("design:returntype", void 0)
], PantryController.prototype, "upsert", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PantryController.prototype, "bulkReplace", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pantry_item_dto_1.UpdatePantryItemDto]),
    __metadata("design:returntype", void 0)
], PantryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PantryController.prototype, "remove", null);
exports.PantryController = PantryController = __decorate([
    (0, common_1.Controller)('pantry'),
    __metadata("design:paramtypes", [pantry_service_1.PantryService])
], PantryController);
//# sourceMappingURL=pantry.controller.js.map