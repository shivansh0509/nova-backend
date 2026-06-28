import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddWishlistDto {
  @ApiProperty({ example: 'prod_123' })
  @IsString()
  productId!: string;
}
