import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdatePantryItemDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  expiryDate?: string;
}
