import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGroceryItemDto {
  @IsString()
  @MaxLength(50)
  id: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsBoolean()
  isPurchased?: boolean;
}
