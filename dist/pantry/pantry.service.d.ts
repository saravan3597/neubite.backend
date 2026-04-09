import { Repository } from 'typeorm';
import { PantryItemEntity } from './entities/pantry-item.entity';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { UpdatePantryItemDto } from './dto/update-pantry-item.dto';
export declare class PantryService {
    private readonly repo;
    constructor(repo: Repository<PantryItemEntity>);
    findAll(): Promise<PantryItemEntity[]>;
    upsert(dto: CreatePantryItemDto): Promise<PantryItemEntity>;
    update(id: string, dto: UpdatePantryItemDto): Promise<PantryItemEntity>;
    remove(id: string): Promise<void>;
    bulkReplace(items: CreatePantryItemDto[]): Promise<PantryItemEntity[]>;
}
