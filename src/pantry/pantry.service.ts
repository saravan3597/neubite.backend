import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PantryItemEntity } from './entities/pantry-item.entity';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { UpdatePantryItemDto } from './dto/update-pantry-item.dto';

@Injectable()
export class PantryService {
  constructor(
    @InjectRepository(PantryItemEntity)
    private readonly repo: Repository<PantryItemEntity>,
  ) {}

  findAll(userId: string): Promise<PantryItemEntity[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'ASC' } });
  }

  async upsert(userId: string, dto: CreatePantryItemDto): Promise<PantryItemEntity> {
    const existing = await this.repo.findOne({ where: { id: dto.id, userId } });
    if (existing) {
      await this.repo.update({ id: dto.id, userId }, { name: dto.name, quantity: dto.quantity, unit: dto.unit, expiryDate: dto.expiryDate });
      return this.repo.findOne({ where: { id: dto.id, userId } }) as Promise<PantryItemEntity>;
    }
    const item = this.repo.create({ ...dto, userId });
    return this.repo.save(item);
  }

  async update(userId: string, id: string, dto: UpdatePantryItemDto): Promise<PantryItemEntity> {
    await this.repo.update({ id, userId }, dto);
    return this.repo.findOne({ where: { id, userId } }) as Promise<PantryItemEntity>;
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.repo.delete({ id, userId });
  }

  async bulkReplace(userId: string, items: CreatePantryItemDto[]): Promise<PantryItemEntity[]> {
    await this.repo.delete({ userId });
    const entities = items.map((dto) => this.repo.create({ ...dto, userId }));
    return this.repo.save(entities);
  }
}
