"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const redis_service_1 = require("../redis/redis.service");
const CACHE_TTL = 300;
const CACHE_PREFIX = 'products';
let ProductsService = class ProductsService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async create(createDto) {
        const product = await this.prisma.product.create({
            data: createDto,
        });
        await this.redis.delByPattern(`${CACHE_PREFIX}:*`);
        return product;
    }
    async findAll(query) {
        const { search, category, sort, page = 1, limit = 20 } = query || {};
        const cacheKey = `${CACHE_PREFIX}:list:${JSON.stringify({ search, category, sort, page, limit })}`;
        return this.redis.getOrSet(cacheKey, async () => {
            let orderBy = {
                createdAt: 'desc',
            };
            if (sort === 'price-asc')
                orderBy = { price: 'asc' };
            if (sort === 'price-desc')
                orderBy = { price: 'desc' };
            if (sort === 'name-asc')
                orderBy = { name: 'asc' };
            const where = { deletedAt: null };
            if (category && category !== 'all') {
                const cat = await this.prisma.category.findUnique({
                    where: { slug: category },
                });
                if (cat)
                    where.categoryId = cat.id;
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
        }, CACHE_TTL);
    }
    async findOne(idOrSlug) {
        const cacheKey = `${CACHE_PREFIX}:item:${idOrSlug}`;
        return this.redis.getOrSet(cacheKey, async () => {
            const product = await this.prisma.product.findFirst({
                where: {
                    OR: [{ id: idOrSlug }, { slug: idOrSlug }],
                    deletedAt: null,
                },
                include: { category: true },
            });
            if (!product)
                throw new common_1.NotFoundException('Product not found');
            return product;
        }, CACHE_TTL);
    }
    async update(id, updateDto) {
        const product = await this.prisma.product.update({
            where: { id },
            data: updateDto,
        });
        await this.redis.delByPattern(`${CACHE_PREFIX}:*`);
        return product;
    }
    async remove(id) {
        const product = await this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        await this.redis.delByPattern(`${CACHE_PREFIX}:*`);
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        redis_service_1.RedisService])
], ProductsService);
//# sourceMappingURL=products.service.js.map