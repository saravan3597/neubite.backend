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

  findAll(userId: string): Promise<GroceryItemEntity[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'ASC' } });
  }

  async upsert(userId: string, dto: CreateGroceryItemDto): Promise<GroceryItemEntity> {
    const existing = await this.repo.findOne({ where: { id: dto.id, userId } });
    if (existing) {
      await this.repo.update({ id: dto.id, userId }, { name: dto.name, isPurchased: dto.isPurchased ?? existing.isPurchased });
      return this.repo.findOne({ where: { id: dto.id, userId } }) as Promise<GroceryItemEntity>;
    }
    const item = this.repo.create({ ...dto, userId, isPurchased: dto.isPurchased ?? false });
    return this.repo.save(item);
  }

  async setPurchased(userId: string, id: string, isPurchased: boolean): Promise<GroceryItemEntity> {
    await this.repo.update({ id, userId }, { isPurchased });
    return this.repo.findOne({ where: { id, userId } }) as Promise<GroceryItemEntity>;
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.repo.delete({ id, userId });
  }

  async bulkReplace(userId: string, items: CreateGroceryItemDto[]): Promise<GroceryItemEntity[]> {
    await this.repo.delete({ userId });
    const entities = items.map((dto) => this.repo.create({ ...dto, userId, isPurchased: dto.isPurchased ?? false }));
    return this.repo.save(entities);
  }
}
