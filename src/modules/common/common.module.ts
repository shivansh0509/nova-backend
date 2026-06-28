import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CommonService } from './common.service';
import { LoggerService } from './services/logger.service';
import { SecurityMiddleware } from './middleware/security.middleware';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';

@Module({
  providers: [CommonService, LoggerService],
  exports: [CommonService, LoggerService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware, RequestLoggerMiddleware).forRoutes('*');
  }
}
