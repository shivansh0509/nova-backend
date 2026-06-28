import { HealthCheckService, PrismaHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';
export declare class HealthController {
    private health;
    private prismaHealth;
    private memory;
    private db;
    private redis;
    constructor(health: HealthCheckService, prismaHealth: PrismaHealthIndicator, memory: MemoryHealthIndicator, db: DatabaseService, redis: RedisService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap"> & ({
        redis: {
            status: "up";
        };
    } | {
        redis: {
            status: "down";
        };
    })) & import("@nestjs/terminus").HealthIndicatorResult<"database">, Partial<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap"> & ({
        redis: {
            status: "up";
        };
    } | {
        redis: {
            status: "down";
        };
    })) & import("@nestjs/terminus").HealthIndicatorResult<"database">> | undefined, Partial<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap"> & ({
        redis: {
            status: "up";
        };
    } | {
        redis: {
            status: "down";
        };
    })) & import("@nestjs/terminus").HealthIndicatorResult<"database">> | undefined>>;
    readiness(): Promise<import("@nestjs/terminus").HealthCheckResult<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        redis: {
            status: "up";
        };
    } | {
        redis: {
            status: "down";
        };
    })) & import("@nestjs/terminus").HealthIndicatorResult<"database">, Partial<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        redis: {
            status: "up";
        };
    } | {
        redis: {
            status: "down";
        };
    })) & import("@nestjs/terminus").HealthIndicatorResult<"database">> | undefined, Partial<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        redis: {
            status: "up";
        };
    } | {
        redis: {
            status: "down";
        };
    })) & import("@nestjs/terminus").HealthIndicatorResult<"database">> | undefined>>;
    liveness(): {
        status: string;
        uptime: number;
        timestamp: string;
        memory: {
            heapUsed: string;
            heapTotal: string;
            rss: string;
        };
    };
    private checkRedis;
}
