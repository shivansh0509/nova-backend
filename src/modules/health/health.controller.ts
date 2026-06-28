import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private db: DatabaseService,
    private redis: RedisService,
  ) {}

  /**
   * Comprehensive health check — DB + Redis + Memory
   */
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Comprehensive health check' })
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.db),
      () => this.checkRedis(),
      () => this.memory.checkHeap('memory_heap', 256 * 1024 * 1024),
    ]);
  }

  /**
   * Readiness probe — checks if dependencies (DB + Redis) are connected.
   * Use for Kubernetes readiness probe.
   */
  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe — DB + Redis connected' })
  readiness() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.db),
      () => this.checkRedis(),
    ]);
  }

  /**
   * Liveness probe — checks if process is alive and not OOM.
   * Use for Kubernetes liveness probe.
   */
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe — process alive' })
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

  private async checkRedis() {
    try {
      const isHealthy = await this.redis.ping();
      if (isHealthy) {
        return { redis: { status: 'up' as const } };
      }
      return { redis: { status: 'down' as const } };
    } catch {
      return { redis: { status: 'down' as const } };
    }
  }
}
