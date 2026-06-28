import { PaymentProviderInterface } from './payment-provider.interface';
import { ConfigService } from '@nestjs/config';
export declare class StripeProvider implements PaymentProviderInterface {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    createIntent(orderId: string, amount: number, currency: string): Promise<Record<string, unknown>>;
    verifyPayment(orderId: string, data: Record<string, unknown>): Promise<boolean>;
    processWebhook(payload: Record<string, unknown>, signature: string): Promise<{
        orderId: string;
        status: string;
        transactionId?: string;
    }>;
    refund(transactionId: string, amount: number, currency: string, reason?: string): Promise<Record<string, unknown>>;
}
