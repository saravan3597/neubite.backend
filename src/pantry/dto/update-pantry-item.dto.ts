import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdatePantryItemDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;
}
