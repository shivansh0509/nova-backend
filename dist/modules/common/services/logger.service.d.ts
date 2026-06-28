import { LoggerService as NestLoggerService } from '@nestjs/common';
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
export declare class LoggerService implements NestLoggerService {
    private formatMessage;
    log(message: string, context?: string, meta?: LogContext): void;
    error(message: string, trace?: string, context?: string, meta?: LogContext): void;
    warn(message: string, context?: string, meta?: LogContext): void;
    debug(message: string, context?: string, meta?: LogContext): void;
    verbose(message: string, context?: string, meta?: LogContext): void;
}
