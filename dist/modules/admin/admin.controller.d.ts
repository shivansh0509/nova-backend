import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly service;
    constructor(service: AdminService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalOrders: number;
        totalProducts: number;
        totalRevenue: number;
    }>;
}
