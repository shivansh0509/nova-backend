# ─── NOVA Backend — Production Dockerfile ────────────────────────────────────
# Multi-stage build for minimal image size and maximum security

# ─── Stage 1: Dependencies ───────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Install system dependencies for Prisma
RUN apk add --no-cache openssl dumb-init

# Copy only package files for better layer caching
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install all dependencies (needed for build)
RUN npm ci --ignore-scripts && \
    npx prisma generate

# ─── Stage 2: Builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/generated ./generated
COPY . .

# Build the NestJS application
ENV NODE_ENV=production
RUN npm run build

# ─── Stage 3: Production ─────────────────────────────────────────────────────
FROM node:22-alpine AS production

# Install dumb-init for proper PID 1 signal handling
RUN apk add --no-cache openssl dumb-init

# Use non-root user for security
USER node

WORKDIR /app

# Copy package files and install production-only dependencies
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node prisma ./prisma/

RUN npm ci --ignore-scripts --omit=dev && \
    npx prisma generate && \
    npm cache clean --force

# Copy built application
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/generated ./generated

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/v1/health || exit 1

# Use dumb-init as PID 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
