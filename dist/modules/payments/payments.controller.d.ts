import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto, VerifyPaymentDto, RefundPaymentDto } from './dto/payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createIntent(req: {
        user: {
            id: string;
        };
    }, dto: CreatePaymentIntentDto): Promise<any>;
    verifyPayment(req: {
        user: {
            id: string;
        };
    }, dto: VerifyPaymentDto): Promise<{
        success: boolean;
        status: string;
    }>;
    refundPayment(id: string, dto: RefundPaymentDto): Promise<any>;
    getHistory(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
