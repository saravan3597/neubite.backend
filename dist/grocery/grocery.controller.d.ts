import { GroceryService } from './grocery.service';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';
export declare class GroceryController {
    private readonly groceryService;
    constructor(groceryService: GroceryService);
    findAll(): Promise<import("./entities/grocery-item.entity").GroceryItemEntity[]>;
    upsert(dto: CreateGroceryItemDto): Promise<import("./entities/grocery-item.entity").GroceryItemEntity>;
    bulkReplace(body: {
        items: CreateGroceryItemDto[];
    }): Promise<import("./entities/grocery-item.entity").GroceryItemEntity[]>;
    setPurchased(id: string, body: {
        isPurchased: boolean;
    }): Promise<import("./entities/grocery-item.entity").GroceryItemEntity>;
    remove(id: string): Promise<void>;
}
