import { ConfigService } from '@nestjs/config';
import { PaymentsRepository } from './payments.repository';
import { StripeProvider } from './providers/stripe.provider';
import { RazorpayProvider } from './providers/razorpay.provider';
import { DatabaseService } from '../database/database.service';
export declare class PaymentsService {
    private configService;
    private paymentsRepository;
    private prisma;
    private stripeProvider;
    private razorpayProvider;
    private readonly logger;
    private provider;
    private providerName;
    constructor(configService: ConfigService, paymentsRepository: PaymentsRepository, prisma: DatabaseService, stripeProvider: StripeProvider, razorpayProvider: RazorpayProvider);
    createIntent(orderId: string, userId: string): Promise<any>;
    verifyPayment(orderId: string, userId: string, providerData: Record<string, unknown>, clientProvider: string): Promise<{
        success: boolean;
        status: string;
    }>;
    processWebhook(provider: string, payload: Record<string, unknown>, signature: string): Promise<{
        received: boolean;
    }>;
    refundPayment(orderId: string, reason?: string): Promise<any>;
    getHistory(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        orderId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        provider: string;
        transactionId: string | null;
    }[]>;
}
