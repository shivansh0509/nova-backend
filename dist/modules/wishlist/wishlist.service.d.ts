import { DatabaseService } from '../database/database.service';
import { AddWishlistDto } from './dto/add-wishlist.dto';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    private getOrCreateWishlist;
    getWishlist(userId: string): Promise<{
        products: {
            description: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            slug: string;
            price: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            image: string | null;
            categoryId: string;
        }[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addProduct(userId: string, addDto: AddWishlistDto): Promise<{
        products: {
            description: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            slug: string;
            price: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            image: string | null;
            categoryId: string;
        }[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeProduct(userId: string, productId: string): Promise<{
        products: {
            description: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            slug: string;
            price: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            image: string | null;
            categoryId: string;
        }[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
