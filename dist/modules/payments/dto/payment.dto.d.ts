export declare class CreatePaymentIntentDto {
    orderId: string;
}
export declare class VerifyPaymentDto {
    orderId: string;
    provider: string;
    providerData?: Record<string, any>;
}
export declare class RefundPaymentDto {
    reason?: string;
}
