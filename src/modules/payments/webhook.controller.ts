import { Controller, Post, Headers, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments/webhook')
export class WebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':provider')
  async handleWebhook(
    @Param('provider') provider: string,
    @Headers('stripe-signature') stripeSignature: string,
    @Headers('x-razorpay-signature') razorpaySignature: string,
    @Body() payload: Record<string, unknown>,
  ) {
    const signature =
      provider === 'stripe' ? stripeSignature : razorpaySignature;
    return this.paymentsService.processWebhook(provider, payload, signature);
  }
}
