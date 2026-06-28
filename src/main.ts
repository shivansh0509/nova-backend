import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
config();
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { GlobalExceptionFilter } from './modules/common/filters/global-exception.filter';
import { TransformInterceptor } from './modules/common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // API Versioning
  app.setGlobalPrefix('api/v1');

  // ─── Security ───────────────────────────────────────────────────────────────
  app.use(
    helmet({
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
    }),
  );

  // CORS — restrict origins per environment
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';
  app.enableCors({
    origin:
      corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    maxAge: 86400,
  });

  // ─── Compression ────────────────────────────────────────────────────────────
  app.use(compression({ level: 6, threshold: 1024 }));

  // ─── Global Pipes, Filters & Interceptors ───────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // ─── Swagger (conditional) ──────────────────────────────────────────────────
  const swaggerEnabled = configService.get<boolean | string>('SWAGGER_ENABLED');
  logger.log(`Swagger enabled value: ${swaggerEnabled} (type: ${typeof swaggerEnabled})`);
  if (swaggerEnabled === true || swaggerEnabled === 'true' || swaggerEnabled === '1') {
    const swaggerConfig = new DocumentBuilder()
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
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('Swagger documentation enabled at /api/docs');
  }

  // ─── Start Server ──────────────────────────────────────────────────────────
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api/v1`);
  logger.log(`Environment: ${configService.get<string>('NODE_ENV')}`);
}
void bootstrap();
