import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroceryItemEntity } from './entities/grocery-item.entity';
import { GroceryService } from './grocery.service';
import { GroceryController } from './grocery.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GroceryItemEntity])],
  controllers: [GroceryController],
  providers: [GroceryService],
})
export class GroceryModule {}
