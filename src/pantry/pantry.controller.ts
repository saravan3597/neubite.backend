import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CognitoAuthGuard } from '../auth/guards/cognito-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { PantryService } from './pantry.service';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { UpdatePantryItemDto } from './dto/update-pantry-item.dto';

@Controller('pantry')
@UseGuards(CognitoAuthGuard)
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.pantryService.findAll(user.userId);
  }

  @Post()
  upsert(@CurrentUser() user: AuthUser, @Body() dto: CreatePantryItemDto) {
    return this.pantryService.upsert(user.userId, dto);
  }

  @Post('bulk')
  bulkReplace(@CurrentUser() user: AuthUser, @Body() body: { items: CreatePantryItemDto[] }) {
    return this.pantryService.bulkReplace(user.userId, body.items);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdatePantryItemDto) {
    return this.pantryService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.pantryService.remove(user.userId, id);
  }
}
