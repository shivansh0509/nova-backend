import { DatabaseService } from '../database/database.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    private getOrCreateCart;
    getCart(userId: string): Promise<{
        cartItems: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addItem(userId: string, addDto: AddCartItemDto): Promise<{
        cartItems: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateItem(userId: string, productId: string, updateDto: UpdateCartItemDto): Promise<{
        cartItems: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeItem(userId: string, productId: string): Promise<{
        cartItems: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    clearCart(userId: string): Promise<{
        cartItems: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
