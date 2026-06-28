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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const terminus_1 = require("@nestjs/terminus");
const database_service_1 = require("../database/database.service");
const redis_service_1 = require("../redis/redis.service");
let HealthController = class HealthController {
    health;
    prismaHealth;
    memory;
    db;
    redis;
    constructor(health, prismaHealth, memory, db, redis) {
        this.health = health;
        this.prismaHealth = prismaHealth;
        this.memory = memory;
        this.db = db;
        this.redis = redis;
    }
    check() {
        return this.health.check([
            () => this.prismaHealth.pingCheck('database', this.db),
            () => this.checkRedis(),
            () => this.memory.checkHeap('memory_heap', 256 * 1024 * 1024),
        ]);
    }
    readiness() {
        return this.health.check([
            () => this.prismaHealth.pingCheck('database', this.db),
            () => this.checkRedis(),
        ]);
    }
    liveness() {
        const memUsage = process.memoryUsage();
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memory: {
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
                rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
            },
        };
    }
    async checkRedis() {
        try {
            const isHealthy = await this.redis.ping();
            if (isHealthy) {
                return { redis: { status: 'up' } };
            }
            return { redis: { status: 'down' } };
        }
        catch {
            return { redis: { status: 'down' } };
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Comprehensive health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Readiness probe — DB + Redis connected' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "readiness", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Liveness probe — process alive' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "liveness", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        terminus_1.PrismaHealthIndicator,
        terminus_1.MemoryHealthIndicator,
        database_service_1.DatabaseService,
        redis_service_1.RedisService])
], HealthController);
//# sourceMappingURL=health.controller.js.map