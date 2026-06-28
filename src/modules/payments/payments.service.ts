/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsRepository } from './payments.repository';
import { PaymentProviderInterface } from './providers/payment-provider.interface';
import { StripeProvider } from './providers/stripe.provider';
import { RazorpayProvider } from './providers/razorpay.provider';
import { DatabaseService } from '../database/database.service';
import { PaymentStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private provider: PaymentProviderInterface;
  private providerName: string;

  constructor(
    private configService: ConfigService,
    private paymentsRepository: PaymentsRepository,
    private prisma: DatabaseService,
    private stripeProvider: StripeProvider,
    private razorpayProvider: RazorpayProvider,
  ) {
    this.providerName =
      this.configService.get<string>('PAYMENT_PROVIDER') || 'stripe';
    if (this.providerName === 'razorpay') {
      this.provider = this.razorpayProvider;
    } else {
      this.provider = this.stripeProvider;
    }
    this.logger.log(
      `Initialized PaymentsService with provider: ${this.providerName}`,
    );
  }

  async createIntent(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Order does not belong to user');
    }

    // Example currency; should ideally come from store or user settings
    const currency = 'USD';
    const amount = Number(order.totalAmount);

    const intentData = await this.provider.createIntent(
      orderId,
      amount,
      currency,
    );

    // Create or update payment record
    const existingPayment =
      await this.paymentsRepository.findByOrderId(orderId);
    if (!existingPayment) {
      await this.paymentsRepository.create({
        orderId,
        amount,
        currency,
        provider: this.providerName,
        status: PaymentStatus.PENDING,
      });
    } else {
      await this.paymentsRepository.updateStatus(
        orderId,
        PaymentStatus.PENDING,
      );
    }

    return {
      provider: this.providerName,
      ...intentData,
    };
  }

  async verifyPayment(
    orderId: string,
    userId: string,
    providerData: Record<string, unknown>,
    clientProvider: string,
  ) {
    if (clientProvider !== this.providerName) {
      this.logger.warn(
        `Client provider ${clientProvider} differs from server provider ${this.providerName}. Trusting server config.`,
      );
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found or access denied');
    }

    const isValid = await this.provider.verifyPayment(orderId, providerData);

    if (isValid) {
      const transactionId = String(
        (providerData as any)?.transactionId || `mock_tx_${Date.now()}`,
      );
      await this.paymentsRepository.updateStatus(
        orderId,
        PaymentStatus.COMPLETED,
        transactionId,
      );

      // Update order status to Processing after payment success
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      });

      return { success: true, status: 'COMPLETED' };
    } else {
      await this.paymentsRepository.updateStatus(orderId, PaymentStatus.FAILED);
      return { success: false, status: 'FAILED' };
    }
  }

  async processWebhook(
    provider: string,
    payload: Record<string, unknown>,
    signature: string,
  ) {
    const activeProviderName = this.providerName;
    if (provider !== activeProviderName) {
      this.logger.warn(
        `Received webhook for ${provider}, but active provider is ${activeProviderName}`,
      );
      // Depending on requirements, we could process it using the corresponding provider anyway,
      // but for this implementation we will use the active one.
    }

    let webhookResult;
    try {
      webhookResult = await this.provider.processWebhook(payload, signature);
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${String(error.message)}`);
      throw new BadRequestException('Webhook error');
    }

    const { orderId, status, transactionId } = webhookResult;

    if (status === 'COMPLETED') {
      await this.paymentsRepository.updateStatus(
        orderId,
        PaymentStatus.COMPLETED,
        transactionId,
      );
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      });
    } else if (status === 'FAILED') {
      await this.paymentsRepository.updateStatus(
        orderId,
        PaymentStatus.FAILED,
        transactionId,
      );
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PENDING }, // allow retry
      });
    }

    return { received: true };
  }

  async refundPayment(orderId: string, reason?: string) {
    const payment = await this.paymentsRepository.findByOrderId(orderId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment is not in COMPLETED state');
    }

    if (!payment.transactionId) {
      throw new BadRequestException('Missing transaction ID for refund');
    }

    const refundResult = await this.provider.refund(
      payment.transactionId,
      Number(payment.amount),
      payment.currency,
      reason,
    );

    await this.paymentsRepository.updateStatus(orderId, PaymentStatus.REFUNDED);

    return refundResult;
  }

  async getHistory(userId: string) {
    return this.paymentsRepository.findByUserId(userId);
  }
}
