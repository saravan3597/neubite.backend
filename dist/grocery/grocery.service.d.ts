import { Repository } from 'typeorm';
import { GroceryItemEntity } from './entities/grocery-item.entity';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';
export declare class GroceryService {
    private readonly repo;
    constructor(repo: Repository<GroceryItemEntity>);
    findAll(): Promise<GroceryItemEntity[]>;
    upsert(dto: CreateGroceryItemDto): Promise<GroceryItemEntity>;
    setPurchased(id: string, isPurchased: boolean): Promise<GroceryItemEntity>;
    remove(id: string): Promise<void>;
    bulkReplace(items: CreateGroceryItemDto[]): Promise<GroceryItemEntity[]>;
}
