/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PaymentProviderInterface } from './payment-provider.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeProvider implements PaymentProviderInterface {
  private readonly logger = new Logger(StripeProvider.name);

  constructor(private configService: ConfigService) {
    // In a real app, initialize Stripe SDK here:
    // this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), { apiVersion: '2023-10-16' });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async createIntent(
    orderId: string,
    amount: number,
    currency: string,
  ): Promise<Record<string, unknown>> {
    this.logger.log(
      `Creating Stripe PaymentIntent for order ${orderId}, amount: ${amount}`,
    );

    // Mocking Stripe SDK response
    return {
      clientSecret: `pi_mock_${orderId}_secret_${Date.now()}`,
      id: `pi_mock_${orderId}`,
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async verifyPayment(
    orderId: string,
    data: Record<string, unknown>,
  ): Promise<boolean> {
    this.logger.log(`Verifying Stripe payment for order ${orderId}`);
    // In real app, we would verify the PaymentIntent status via Stripe API
    // e.g., const pi = await this.stripe.paymentIntents.retrieve(data.paymentIntentId);
    // return pi.status === 'succeeded';

    if (data && data.mockFailure) {
      return false;
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async processWebhook(
    payload: Record<string, unknown>,
    signature: string,
  ): Promise<{ orderId: string; status: string; transactionId?: string }> {
    this.logger.log(`Processing Stripe webhook`);

    // In real app:
    // const event = this.stripe.webhooks.constructEvent(payload, signature, this.configService.get('STRIPE_WEBHOOK_SECRET'));
    // extract orderId from event.data.object.metadata.orderId

    // Mock behavior
    if (!signature) {
      throw new BadRequestException('Missing signature');
    }

    // Assume payload is a mock event object for this implementation

    const eventType = String(
      (payload as any).type || 'payment_intent.succeeded',
    );

    const orderId = String(
      (payload as any).data?.object?.metadata?.orderId || 'mock_order_id',
    );

    const transactionId = String(
      (payload as any).data?.object?.id || `txn_${Date.now()}`,
    );

    if (eventType === 'payment_intent.succeeded') {
      return { orderId, status: 'COMPLETED', transactionId };
    } else if (eventType === 'payment_intent.payment_failed') {
      return { orderId, status: 'FAILED', transactionId };
    }

    return { orderId, status: 'PENDING' };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async refund(
    transactionId: string,
    amount: number,
    currency: string,
    reason?: string,
  ): Promise<Record<string, unknown>> {
    this.logger.log(`Refunding Stripe payment ${transactionId}`);
    return {
      id: `re_mock_${Date.now()}`,
      object: 'refund',
      amount: Math.round(amount * 100),
      currency,
      reason,
      status: 'succeeded',
    };
  }
}
