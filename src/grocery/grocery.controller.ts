import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CognitoAuthGuard } from '../auth/guards/cognito-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { GroceryService } from './grocery.service';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';

@Controller('grocery')
@UseGuards(CognitoAuthGuard)
export class GroceryController {
  constructor(private readonly groceryService: GroceryService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.groceryService.findAll(user.userId);
  }

  @Post()
  upsert(@CurrentUser() user: AuthUser, @Body() dto: CreateGroceryItemDto) {
    return this.groceryService.upsert(user.userId, dto);
  }

  @Post('bulk')
  bulkReplace(@CurrentUser() user: AuthUser, @Body() body: { items: CreateGroceryItemDto[] }) {
    return this.groceryService.bulkReplace(user.userId, body.items);
  }

  @Patch(':id/purchased')
  setPurchased(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() body: { isPurchased: boolean }) {
    return this.groceryService.setPurchased(user.userId, id, body.isPurchased);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.groceryService.remove(user.userId, id);
  }
}
