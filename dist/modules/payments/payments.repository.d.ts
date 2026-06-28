import { DatabaseService } from '../database/database.service';
import { Payment, PaymentStatus, Prisma } from '@prisma/client';
export declare class PaymentsRepository {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment>;
    findByOrderId(orderId: string): Promise<Payment | null>;
    updateStatus(orderId: string, status: PaymentStatus, transactionId?: string): Promise<Payment>;
    findByUserId(userId: string): Promise<Payment[]>;
}
