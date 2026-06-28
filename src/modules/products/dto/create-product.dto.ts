import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Example property', required: false })
  @IsOptional()
  @IsString()
  exampleProperty?: string;
}
