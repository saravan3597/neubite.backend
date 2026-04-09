import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GroceryService } from './grocery.service';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';

@Controller('grocery')
export class GroceryController {
  constructor(private readonly groceryService: GroceryService) {}

  @Get()
  findAll() {
    return this.groceryService.findAll();
  }

  @Post()
  upsert(@Body() dto: CreateGroceryItemDto) {
    return this.groceryService.upsert(dto);
  }

  @Post('bulk')
  bulkReplace(@Body() body: { items: CreateGroceryItemDto[] }) {
    return this.groceryService.bulkReplace(body.items);
  }

  @Patch(':id/purchased')
  setPurchased(@Param('id') id: string, @Body() body: { isPurchased: boolean }) {
    return this.groceryService.setPurchased(id, body.isPurchased);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groceryService.remove(id);
  }
}
