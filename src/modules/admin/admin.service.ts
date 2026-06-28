import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: DatabaseService) {}

  async getDashboardStats() {
    const [totalUsers, totalOrders, totalProducts] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.product.count({ where: { deletedAt: null } }),
    ]);

    const orders = await this.prisma.order.findMany({
      select: { totalAmount: true },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
    };
  }
}
