import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

export interface LogContext {
  requestId?: string;
  userId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

/**
 * Structured JSON logger for production observability.
 * Outputs logs as JSON objects with consistent schema for log aggregation tools.
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private formatMessage(
    level: string,
    message: string,
    context?: string,
    meta?: LogContext,
  ): string {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      context: context || 'Application',
      message,
      ...meta,
    };
    return JSON.stringify(entry);
  }

  log(message: string, context?: string, meta?: LogContext) {
    console.log(this.formatMessage('info', message, context, meta));
  }

  error(message: string, trace?: string, context?: string, meta?: LogContext) {
    console.error(
      this.formatMessage('error', message, context, {
        ...meta,
        trace,
      }),
    );
  }

  warn(message: string, context?: string, meta?: LogContext) {
    console.warn(this.formatMessage('warn', message, context, meta));
  }

  debug(message: string, context?: string, meta?: LogContext) {
    console.debug(this.formatMessage('debug', message, context, meta));
  }

  verbose(message: string, context?: string, meta?: LogContext) {
    console.log(this.formatMessage('verbose', message, context, meta));
  }
}
