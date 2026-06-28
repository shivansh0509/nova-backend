import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

const CACHE_TTL = 300; // 5 minutes
const CACHE_PREFIX = 'products';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly redis: RedisService,
  ) {}

  async create(createDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createDto as unknown as Prisma.ProductCreateInput,
    });
    // Invalidate product list cache
    await this.redis.delByPattern(`${CACHE_PREFIX}:*`);
    return product;
  }

  async findAll(query?: {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, category, sort, page = 1, limit = 20 } = query || {};

    // Build cache key from query params
    const cacheKey = `${CACHE_PREFIX}:list:${JSON.stringify({ search, category, sort, page, limit })}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        let orderBy: Prisma.ProductOrderByWithRelationInput = {
          createdAt: 'desc',
        };
        if (sort === 'price-asc') orderBy = { price: 'asc' };
        if (sort === 'price-desc') orderBy = { price: 'desc' };
        if (sort === 'name-asc') orderBy = { name: 'asc' };

        const where: Prisma.ProductWhereInput = { deletedAt: null };

        if (category && category !== 'all') {
          const cat = await this.prisma.category.findUnique({
            where: { slug: category },
          });
          if (cat) where.categoryId = cat.id;
        }

        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ];
        }

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
          this.prisma.product.findMany({
            where,
            orderBy,
            include: { category: true },
            skip,
            take: limit,
          }),
          this.prisma.product.count({ where }),
        ]);

        return {
          items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      },
      CACHE_TTL,
    );
  }

  async findOne(idOrSlug: string) {
    const cacheKey = `${CACHE_PREFIX}:item:${idOrSlug}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const product = await this.prisma.product.findFirst({
          where: {
            OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            deletedAt: null,
          },
          include: { category: true },
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
      },
      CACHE_TTL,
    );
  }

  async update(id: string, updateDto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data: updateDto as unknown as Prisma.ProductUpdateInput,
    });
    // Invalidate caches
    await this.redis.delByPattern(`${CACHE_PREFIX}:*`);
    return product;
  }

  async remove(id: string) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    // Invalidate caches
    await this.redis.delByPattern(`${CACHE_PREFIX}:*`);
    return product;
  }
}
