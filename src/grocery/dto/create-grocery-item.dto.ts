import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateGroceryItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isPurchased?: boolean;
}
