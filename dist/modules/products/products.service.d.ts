import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: DatabaseService, redis: RedisService);
    create(createDto: CreateProductDto): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        slug: string;
        price: Prisma.Decimal;
        stock: number;
        image: string | null;
        categoryId: string;
    }>;
    findAll(query?: {
        search?: string;
        category?: string;
        sort?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: ({
            category: {
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                slug: string;
                image: string | null;
            };
        } & {
            description: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            slug: string;
            price: Prisma.Decimal;
            stock: number;
            image: string | null;
            categoryId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(idOrSlug: string): Promise<{
        category: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            slug: string;
            image: string | null;
        };
    } & {
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        slug: string;
        price: Prisma.Decimal;
        stock: number;
        image: string | null;
        categoryId: string;
    }>;
    update(id: string, updateDto: UpdateProductDto): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        slug: string;
        price: Prisma.Decimal;
        stock: number;
        image: string | null;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        slug: string;
        price: Prisma.Decimal;
        stock: number;
        image: string | null;
        categoryId: string;
    }>;
}
