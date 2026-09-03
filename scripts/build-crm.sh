#!/bin/bash
set -e
npm install -g pnpm@11.20.0
pnpm install
pnpm --filter @unidolor/core build
pnpm --filter @unidolor/crm-frontend build
cd apps/crm/backend && npx prisma generate
