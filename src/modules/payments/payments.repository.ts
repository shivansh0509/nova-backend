import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Payment, PaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: DatabaseService) {}

  async create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment> {
    return this.prisma.payment.create({ data });
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { orderId },
    });
  }

  async updateStatus(
    orderId: string,
    status: PaymentStatus,
    transactionId?: string,
  ): Promise<Payment> {
    return this.prisma.payment.update({
      where: { orderId },
      data: {
        status,
        ...(transactionId && { transactionId }),
      },
    });
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: {
        order: {
          userId,
        },
      },
      include: {
        order: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
