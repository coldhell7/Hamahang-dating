# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src/ ./src/

RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache tzdata curl

COPY package*.json ./
RUN npm ci --production --ignore-scripts

COPY --from=builder /app/dist ./dist

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main"]
