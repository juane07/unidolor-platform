# Dockerfile para UNIDOLOR CRM
# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@11.20.0

WORKDIR /app

# Copy package files first for caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/crm/backend/package.json ./apps/crm/backend/
COPY apps/crm/frontend/package.json ./apps/crm/frontend/
COPY apps/chatbot/package.json ./apps/chatbot/

# Install all dependencies (resolves workspace:* correctly)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend
RUN pnpm --filter @unidolor/crm-frontend build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@11.20.0

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/crm/backend/package.json ./apps/crm/backend/
COPY apps/crm/frontend/package.json ./apps/crm/frontend/
COPY apps/chatbot/package.json ./apps/chatbot/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built frontend and backend source
COPY --from=builder /app/apps/crm/frontend/dist ./apps/crm/frontend/dist
COPY --from=builder /app/apps/crm/backend ./apps/crm/backend
COPY --from=builder /app/packages ./packages

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

WORKDIR /app/apps/crm/backend

CMD ["node", "src/server.js"]