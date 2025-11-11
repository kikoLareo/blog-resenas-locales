#!/bin/bash
set -e

echo "🔧 Running Prisma generate..."
npx prisma generate

echo "🗄️ Running Prisma migrations..."
npx prisma migrate deploy

echo "📦 Building Next.js..."
npm run build
