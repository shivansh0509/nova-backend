import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { RedisService } from '../../redis/redis.service';

/**
 * HTTP cache interceptor using Redis.
 * Only caches GET requests. Cache key = URL path + query string.
 */
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(private readonly redis: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = `http:${request.originalUrl}`;

    // Check cache
    const cached = await this.redis.get(cacheKey);
    if (cached !== null) {
      response.setHeader('X-Cache', 'HIT');
      return of(cached);
    }

    // Miss — execute handler and cache result
    response.setHeader('X-Cache', 'MISS');
    return next.handle().pipe(
      tap((data) => {
        void this.redis.set(cacheKey, data, 300); // 5 min default TTL
      }),
    );
  }
}
