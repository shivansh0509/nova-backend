import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { LoggerService } from '../services/logger.service';

/**
 * Request logging middleware.
 * Assigns a unique request ID and logs method, URL, status, and duration.
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new LoggerService();

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = randomUUID();
    const startTime = Date.now();

    // Attach request ID to headers for correlation
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);

    // Log on response finish
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { method, originalUrl } = req;
      const { statusCode } = res;
      const ip =
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        '';
      const userAgent = req.headers['user-agent'] || '';

      const level =
        statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

      if (level === 'error') {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} ${duration}ms`,
          undefined,
          'HTTP',
          {
            requestId,
            method,
            url: originalUrl,
            statusCode,
            duration,
            ip,
            userAgent,
          },
        );
      } else if (level === 'warn') {
        this.logger.warn(
          `${method} ${originalUrl} ${statusCode} ${duration}ms`,
          'HTTP',
          {
            requestId,
            method,
            url: originalUrl,
            statusCode,
            duration,
            ip,
            userAgent,
          },
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${duration}ms`,
          'HTTP',
          {
            requestId,
            method,
            url: originalUrl,
            statusCode,
            duration,
            ip,
            userAgent,
          },
        );
      }
    });

    next();
  }
}
