/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PaymentProviderInterface } from './payment-provider.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RazorpayProvider implements PaymentProviderInterface {
  private readonly logger = new Logger(RazorpayProvider.name);

  constructor(private configService: ConfigService) {
    // In a real app, initialize Razorpay SDK here:
    // this.razorpay = new Razorpay({ key_id: '...', key_secret: '...' });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async createIntent(
    orderId: string,
    amount: number,
    currency: string,
  ): Promise<Record<string, unknown>> {
    this.logger.log(
      `Creating Razorpay Order for order ${orderId}, amount: ${amount}`,
    );

    // Mocking Razorpay Orders API
    return {
      id: `order_mock_${Date.now()}`,
      amount: Math.round(amount * 100), // Razorpay uses smallest currency unit (paise for INR, cents for USD)
      currency,
      receipt: orderId,
      status: 'created',
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async verifyPayment(
    orderId: string,
    data: Record<string, unknown>,
  ): Promise<boolean> {
    this.logger.log(`Verifying Razorpay payment for order ${orderId}`);

    if (data && data.mockFailure) {
      return false;
    }

    // Real implementation involves checking razorpay_signature
    // const generated_signature = crypto.createHmac('sha256', secret)
    //   .update(data.razorpay_order_id + "|" + data.razorpay_payment_id)
    //   .digest('hex');
    // return generated_signature === data.razorpay_signature;

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async processWebhook(
    payload: Record<string, unknown>,
    signature: string,
  ): Promise<{ orderId: string; status: string; transactionId?: string }> {
    this.logger.log(`Processing Razorpay webhook`);

    if (!signature) {
      throw new BadRequestException('Missing signature');
    }

    // Mocking the verification

    const eventType = String((payload as any).event || 'payment.captured');

    const orderId = String(
      (payload as any).payload?.payment?.entity?.notes?.orderId ||
        'mock_order_id',
    );

    const transactionId = String(
      (payload as any).payload?.payment?.entity?.id || `pay_${Date.now()}`,
    );

    if (eventType === 'payment.captured') {
      return { orderId, status: 'COMPLETED', transactionId };
    } else if (eventType === 'payment.failed') {
      return { orderId, status: 'FAILED', transactionId };
    }

    return { orderId, status: 'PENDING' };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async refund(
    transactionId: string,
    amount: number,
    currency: string,
    _reason?: string,
  ): Promise<Record<string, unknown>> {
    this.logger.log(`Refunding Razorpay payment ${transactionId}`);
    return {
      id: `rfnd_mock_${Date.now()}`,
      entity: 'refund',
      amount: Math.round(amount * 100),
      currency,
      payment_id: transactionId,
      status: 'processed',
    };
  }
}
