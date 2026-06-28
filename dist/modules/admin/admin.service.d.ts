import { DatabaseService } from '../database/database.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalOrders: number;
        totalProducts: number;
        totalRevenue: number;
    }>;
}
