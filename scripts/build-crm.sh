#!/bin/bash
set -e
npm install -g pnpm@11.20.0
pnpm install
pnpm --filter @unidolor/crm-frontend build
