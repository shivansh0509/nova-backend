import { WishlistService } from './wishlist.service';
import { AddWishlistDto } from './dto/add-wishlist.dto';
import type { CustomRequest } from '../auth/custom-request.interface';
export declare class WishlistController {
    private readonly service;
    constructor(service: WishlistService);
    getWishlist(req: CustomRequest): Promise<{
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
    addProduct(req: CustomRequest, addDto: AddWishlistDto): Promise<{
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
    removeProduct(req: CustomRequest, productId: string): Promise<{
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
