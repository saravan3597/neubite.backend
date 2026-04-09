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
exports.GroceryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const grocery_item_entity_1 = require("./entities/grocery-item.entity");
let GroceryService = class GroceryService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findAll() {
        return this.repo.find({ order: { createdAt: 'ASC' } });
    }
    async upsert(dto) {
        const existing = await this.repo.findOne({ where: { id: dto.id } });
        if (existing) {
            await this.repo.update(dto.id, { name: dto.name, isPurchased: dto.isPurchased ?? existing.isPurchased });
            return this.repo.findOne({ where: { id: dto.id } });
        }
        const item = this.repo.create({ ...dto, isPurchased: dto.isPurchased ?? false });
        return this.repo.save(item);
    }
    async setPurchased(id, isPurchased) {
        await this.repo.update(id, { isPurchased });
        return this.repo.findOne({ where: { id } });
    }
    async remove(id) {
        await this.repo.delete(id);
    }
    async bulkReplace(items) {
        await this.repo.clear();
        const entities = items.map((dto) => this.repo.create({ ...dto, isPurchased: dto.isPurchased ?? false }));
        return this.repo.save(entities);
    }
};
exports.GroceryService = GroceryService;
exports.GroceryService = GroceryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(grocery_item_entity_1.GroceryItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GroceryService);
//# sourceMappingURL=grocery.service.js.map