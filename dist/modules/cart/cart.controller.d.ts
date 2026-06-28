import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import type { CustomRequest } from '../auth/custom-request.interface';
export declare class CartController {
    private readonly service;
    constructor(service: CartService);
    getCart(req: CustomRequest): Promise<{
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
    addItem(req: CustomRequest, addDto: AddCartItemDto): Promise<{
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
    updateItem(req: CustomRequest, productId: string, updateDto: UpdateCartItemDto): Promise<{
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
    removeItem(req: CustomRequest, productId: string): Promise<{
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
    clearCart(req: CustomRequest): Promise<{
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
