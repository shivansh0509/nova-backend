"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const global_exception_filter_1 = require("./modules/common/filters/global-exception.filter");
const transform_interceptor_1 = require("./modules/common/interceptors/transform.interceptor");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const logger = new common_1.Logger('Bootstrap');
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api/v1');
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", 'https:', 'data:'],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    const corsOrigin = configService.get('CORS_ORIGIN') || '*';
    app.enableCors({
        origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        maxAge: 86400,
    });
    app.use((0, compression_1.default)({ level: 6, threshold: 1024 }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const swaggerEnabled = configService.get('SWAGGER_ENABLED');
    logger.log(`Swagger enabled value: ${swaggerEnabled} (type: ${typeof swaggerEnabled})`);
    if (swaggerEnabled === true || swaggerEnabled === 'true' || swaggerEnabled === '1') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('NOVA API')
            .setDescription('The NOVA Backend API documentation')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('Health', 'Health check endpoints')
            .addTag('Auth', 'Authentication endpoints')
            .addTag('Products', 'Product management')
            .addTag('Orders', 'Order management')
            .addTag('Cart', 'Shopping cart')
            .addTag('Wishlist', 'Wishlist management')
            .addTag('Admin', 'Admin panel')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
        logger.log('Swagger documentation enabled at /api/docs');
    }
    const port = configService.get('PORT') || 3001;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}/api/v1`);
    logger.log(`Environment: ${configService.get('NODE_ENV')}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map