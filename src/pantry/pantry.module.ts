import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PantryItemEntity } from './entities/pantry-item.entity';
import { PantryService } from './pantry.service';
import { PantryController } from './pantry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PantryItemEntity])],
  controllers: [PantryController],
  providers: [PantryService],
})
export class PantryModule {}
