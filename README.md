# NOVA — Backend API

> NestJS REST API with Prisma, PostgreSQL, Redis caching, JWT authentication, and structured logging.

---

## Quick Start

```bash
# Start infrastructure
docker compose up -d

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run start:dev
```

The API will be available at `http://localhost:3001/api/v1`

---

## Environment Setup

| Variable                | Required | Default       | Description                        |
| ----------------------- | -------- | ------------- | ---------------------------------- |
| `NODE_ENV`              | Yes      | `development` | Runtime environment                |
| `PORT`                  | Yes      | `3001`        | Server port                        |
| `DATABASE_URL`          | Yes      | —             | PostgreSQL connection string       |
| `REDIS_HOST`            | Yes      | `localhost`   | Redis hostname                     |
| `REDIS_PORT`            | Yes      | `6379`        | Redis port                         |
| `JWT_SECRET`            | Yes      | —             | JWT signing secret (min 32 chars)  |
| `JWT_EXPIRES_IN`        | No       | `15m`         | Access token expiry                |
| `REFRESH_TOKEN_SECRET`  | No       | —             | Refresh token secret               |
| `REFRESH_TOKEN_EXPIRES_IN` | No    | `7d`          | Refresh token expiry               |
| `CORS_ORIGIN`           | No       | `*`           | Allowed CORS origins (comma-sep)   |
| `COOKIE_SECRET`         | No       | —             | Cookie signing secret              |
| `SWAGGER_ENABLED`       | No       | `true`        | Enable Swagger docs                |
| `LOG_LEVEL`             | No       | `info`        | Logging level                      |

### Environment Files

- `.env.development` — Local dev with debug logging
- `.env.staging` — Staging with info logging, Swagger enabled
- `.env.production` — Production with warn logging, Swagger disabled

---

## API Documentation

Swagger UI: `http://localhost:3001/api/docs` (when `SWAGGER_ENABLED=true`)

### Health Endpoints

```
GET /api/v1/health       → Comprehensive check (DB + Redis + Memory)
GET /api/v1/health/ready → Readiness probe (DB + Redis connected)
GET /api/v1/health/live  → Liveness probe (process alive, memory usage)
```

---

## Security

- **Helmet** — HTTP security headers + CSP
- **CORS** — Configurable origins per environment
- **Rate Limiting** — Tiered throttling (10/s, 50/10s, 100/60s)
- **Validation** — Global ValidationPipe with whitelist + forbidNonWhitelisted
- **Security Middleware** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

---

## Caching

Redis-backed caching with automatic invalidation:

- Product listings: 5min TTL, invalidated on create/update/delete
- Single products: 5min TTL, invalidated on update/delete
- Pattern-based cache invalidation (`products:*`)

---

## Logging

Structured JSON logging for production observability:

```json
{
  "timestamp": "2025-01-01T00:00:00.000Z",
  "level": "info",
  "context": "HTTP",
  "message": "GET /api/v1/products 200 45ms",
  "requestId": "abc-123",
  "method": "GET",
  "url": "/api/v1/products",
  "statusCode": 200,
  "duration": 45
}
```

---

## Scripts

```bash
npm run start:dev    # Development with hot reload
npm run start:prod   # Production
npm run build        # Compile TypeScript
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Unit tests
npm run test:e2e     # E2E tests
```

---

## Docker

### Development (Postgres + Redis only)

```bash
docker compose up -d
```

### Production (full stack)

Use the root `docker-compose.yml`:

```bash
cd .. && docker compose up -d --build
```
