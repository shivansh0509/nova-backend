import { PaymentsService } from './payments.service';
export declare class WebhookController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    handleWebhook(provider: string, stripeSignature: string, razorpaySignature: string, payload: Record<string, unknown>): Promise<{
        received: boolean;
    }>;
}
