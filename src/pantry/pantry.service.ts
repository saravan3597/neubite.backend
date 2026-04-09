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

  findAll(): Promise<PantryItemEntity[]> {
    return this.repo.find({ order: { createdAt: 'ASC' } });
  }

  async upsert(dto: CreatePantryItemDto): Promise<PantryItemEntity> {
    const existing = await this.repo.findOne({ where: { id: dto.id } });
    if (existing) {
      await this.repo.update(dto.id, { name: dto.name, quantity: dto.quantity, unit: dto.unit, expiryDate: dto.expiryDate });
      return this.repo.findOne({ where: { id: dto.id } }) as Promise<PantryItemEntity>;
    }
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: string, dto: UpdatePantryItemDto): Promise<PantryItemEntity> {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } }) as Promise<PantryItemEntity>;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async bulkReplace(items: CreatePantryItemDto[]): Promise<PantryItemEntity[]> {
    await this.repo.clear();
    const entities = items.map((dto) => this.repo.create(dto));
    return this.repo.save(entities);
  }
}
