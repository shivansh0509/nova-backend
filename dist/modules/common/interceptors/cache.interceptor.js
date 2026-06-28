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
exports.HttpCacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const redis_service_1 = require("../../redis/redis.service");
let HttpCacheInterceptor = class HttpCacheInterceptor {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (request.method !== 'GET') {
            return next.handle();
        }
        const cacheKey = `http:${request.originalUrl}`;
        const cached = await this.redis.get(cacheKey);
        if (cached !== null) {
            response.setHeader('X-Cache', 'HIT');
            return (0, rxjs_1.of)(cached);
        }
        response.setHeader('X-Cache', 'MISS');
        return next.handle().pipe((0, operators_1.tap)((data) => {
            void this.redis.set(cacheKey, data, 300);
        }));
    }
};
exports.HttpCacheInterceptor = HttpCacheInterceptor;
exports.HttpCacheInterceptor = HttpCacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], HttpCacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map