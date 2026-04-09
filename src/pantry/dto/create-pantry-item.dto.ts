import { IsNumber, IsString, Min } from 'class-validator';

export class CreatePantryItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsString()
  expiryDate: string;
}
