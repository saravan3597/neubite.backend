import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroceryItemEntity } from './entities/grocery-item.entity';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';

@Injectable()
export class GroceryService {
  constructor(
    @InjectRepository(GroceryItemEntity)
    private readonly repo: Repository<GroceryItemEntity>,
  ) {}

  findAll(): Promise<GroceryItemEntity[]> {
    return this.repo.find({ order: { createdAt: 'ASC' } });
  }

  async upsert(dto: CreateGroceryItemDto): Promise<GroceryItemEntity> {
    const existing = await this.repo.findOne({ where: { id: dto.id } });
    if (existing) {
      await this.repo.update(dto.id, { name: dto.name, isPurchased: dto.isPurchased ?? existing.isPurchased });
      return this.repo.findOne({ where: { id: dto.id } }) as Promise<GroceryItemEntity>;
    }
    const item = this.repo.create({ ...dto, isPurchased: dto.isPurchased ?? false });
    return this.repo.save(item);
  }

  async setPurchased(id: string, isPurchased: boolean): Promise<GroceryItemEntity> {
    await this.repo.update(id, { isPurchased });
    return this.repo.findOne({ where: { id } }) as Promise<GroceryItemEntity>;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async bulkReplace(items: CreateGroceryItemDto[]): Promise<GroceryItemEntity[]> {
    await this.repo.clear();
    const entities = items.map((dto) => this.repo.create({ ...dto, isPurchased: dto.isPurchased ?? false }));
    return this.repo.save(entities);
  }
}
