"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const common_service_1 = require("./common.service");
const logger_service_1 = require("./services/logger.service");
const security_middleware_1 = require("./middleware/security.middleware");
const request_logger_middleware_1 = require("./middleware/request-logger.middleware");
let CommonModule = class CommonModule {
    configure(consumer) {
        consumer.apply(security_middleware_1.SecurityMiddleware, request_logger_middleware_1.RequestLoggerMiddleware).forRoutes('*');
    }
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        providers: [common_service_1.CommonService, logger_service_1.LoggerService],
        exports: [common_service_1.CommonService, logger_service_1.LoggerService],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map