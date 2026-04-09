import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PantryService } from './pantry.service';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { UpdatePantryItemDto } from './dto/update-pantry-item.dto';

@Controller('pantry')
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Get()
  findAll() {
    return this.pantryService.findAll();
  }

  @Post()
  upsert(@Body() dto: CreatePantryItemDto) {
    return this.pantryService.upsert(dto);
  }

  @Post('bulk')
  bulkReplace(@Body() body: { items: CreatePantryItemDto[] }) {
    return this.pantryService.bulkReplace(body.items);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePantryItemDto) {
    return this.pantryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pantryService.remove(id);
  }
}
