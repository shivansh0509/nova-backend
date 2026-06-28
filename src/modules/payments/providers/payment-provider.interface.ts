export interface PaymentProviderInterface {
  createIntent(orderId: string, amount: number, currency: string): Promise<any>;
  verifyPayment(orderId: string, data: any): Promise<boolean>;
  processWebhook(
    payload: any,
    signature: string,
  ): Promise<{ orderId: string; status: string; transactionId?: string }>;
  refund(
    transactionId: string,
    amount: number,
    currency: string,
    reason?: string,
  ): Promise<any>;
}
