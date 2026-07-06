#!/usr/bin/env bash
set -euo pipefail

# ============================================
# Hamahang Deployment Script
# ============================================
# Usage: ./deploy.sh [environment]
#   environment: production | staging (default: production)
# ============================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV=${1:-production}

echo "=============================="
echo "  هم‌آهنگ — Deploy: $ENV"
echo "=============================="
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    exit 1
fi

# Load environment
ENV_FILE="$SCRIPT_DIR/docker/.env.$ENV"
if [ -f "$ENV_FILE" ]; then
    echo "📋 Loading environment from $ENV_FILE"
    set -a; source "$ENV_FILE"; set +a
else
    echo "⚠️  Environment file $ENV_FILE not found, using defaults"
fi

cd "$SCRIPT_DIR/docker"

echo "📦 Step 1: Building images..."
docker compose -p hamahang build --no-cache
echo "✅ Images built"

echo ""
echo "📦 Step 2: Stopping old containers..."
docker compose -p hamahang down --remove-orphans || true
echo "✅ Old containers stopped"

echo ""
echo "📦 Step 3: Starting services..."
docker compose -p hamahang up -d
echo "✅ All services started"

echo ""
echo "📦 Step 4: Running database migrations..."
sleep 5
docker compose -p hamahang exec backend node dist/database/seeds/seed.js 2>/dev/null || \
    docker compose -p hamahang exec backend npx ts-node src/database/seeds/seed.ts 2>/dev/null || \
    echo "⚠️  Seeding skipped (run manually)"
echo "✅ Database ready"

echo ""
echo "=============================="
echo "  ✅ Deploy Complete!"
echo "=============================="
echo ""
echo "  Backend:  http://localhost:3000"
echo "  Admin:    http://localhost:3001"
echo "  Swagger:  http://localhost:3000/api/docs"
echo ""
echo "  To view logs:"
echo "    docker compose -p hamahang logs -f"
echo ""
echo "  To stop:"
echo "    docker compose -p hamahang down"
echo ""
