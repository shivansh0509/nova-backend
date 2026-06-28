import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../../redis/redis.service';
export declare class HttpCacheInterceptor implements NestInterceptor {
    private readonly redis;
    constructor(redis: RedisService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>>;
}
