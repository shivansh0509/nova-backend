import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsObject()
  @IsOptional()
  providerData?: Record<string, any>;
}

export class RefundPaymentDto {
  @IsString()
  @IsOptional()
  reason?: string;
}
