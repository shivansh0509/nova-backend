import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { WebhookController } from './webhook.controller';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './payments.repository';
import { StripeProvider } from './providers/stripe.provider';
import { RazorpayProvider } from './providers/razorpay.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentsController, WebhookController],
  providers: [
    PaymentsService,
    PaymentsRepository,
    StripeProvider,
    RazorpayProvider,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
