import { IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreatePantryItemDto {
  @IsString()
  @MaxLength(50)
  id: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  @MaxLength(20)
  unit: string;

  @IsString()
  @MaxLength(20)
  expiryDate: string;
}
