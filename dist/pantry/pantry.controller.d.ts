import { PantryService } from './pantry.service';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { UpdatePantryItemDto } from './dto/update-pantry-item.dto';
export declare class PantryController {
    private readonly pantryService;
    constructor(pantryService: PantryService);
    findAll(): Promise<import("./entities/pantry-item.entity").PantryItemEntity[]>;
    upsert(dto: CreatePantryItemDto): Promise<import("./entities/pantry-item.entity").PantryItemEntity>;
    bulkReplace(body: {
        items: CreatePantryItemDto[];
    }): Promise<import("./entities/pantry-item.entity").PantryItemEntity[]>;
    update(id: string, dto: UpdatePantryItemDto): Promise<import("./entities/pantry-item.entity").PantryItemEntity>;
    remove(id: string): Promise<void>;
}
