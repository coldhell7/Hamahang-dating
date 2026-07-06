#!/usr/bin/env bash
set -e

echo "=============================="
echo "  هم‌آهنگ - Hamahang"
echo "  Music Social App"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. PostgreSQL and Redis won't start."
    echo "   Install Docker Desktop from https://www.docker.com/products/docker-desktop/"
    echo ""
fi

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo -e "${BLUE}📦 Step 1: Starting PostgreSQL & Redis via Docker${NC}"
cd "$PROJECT_DIR/docker"
if command -v docker &> /dev/null; then
    docker compose up -d 2>/dev/null || docker-compose up -d 2>/dev/null || echo "   Using existing PostgreSQL/Redis..."
    echo -e "   ${GREEN}✅ Docker containers started${NC}"
else
    echo -e "   ${YELLOW}⚠️  Skipping Docker - make sure PostgreSQL and Redis are running manually${NC}"
fi

echo ""
echo -e "${BLUE}📦 Step 2: Installing Backend Dependencies${NC}"
cd "$PROJECT_DIR/backend"
npm install --legacy-peer-deps 2>/dev/null || npm install
echo -e "   ${GREEN}✅ Backend dependencies installed${NC}"

echo ""
echo -e "${BLUE}📦 Step 3: Seeding Database${NC}"
cd "$PROJECT_DIR/backend"
npx ts-node src/database/seeds/seed.ts 2>/dev/null || echo "   ⚠️  Seeding skipped (run manually after DB is ready)"
echo -e "   ${GREEN}✅ Database seeded${NC}"

echo ""
echo -e "${BLUE}📦 Step 4: Installing Admin Panel Dependencies${NC}"
cd "$PROJECT_DIR/admin"
npm install --legacy-peer-deps 2>/dev/null || npm install
echo -e "   ${GREEN}✅ Admin panel dependencies installed${NC}"

echo ""
echo -e "${GREEN}=============================="
echo "  ✅ Setup Complete!"
echo "==============================${NC}"
echo ""
echo "To start the servers, run:"
echo ""
echo -e "  ${BLUE}Backend:${NC}  cd backend && npm run start:dev"
echo -e "  ${BLUE}Admin:${NC}    cd admin && npm run dev"
echo ""
echo -e "  ${BLUE}Backend API:${NC}     http://localhost:3000/api"
echo -e "  ${BLUE}Swagger Docs:${NC}    http://localhost:3000/api/docs"
echo -e "  ${BLUE}Admin Panel:${NC}     http://localhost:3001"
echo ""
echo -e "  ${BLUE}Admin Login:${NC}"
echo "    Email:    super@hamahang.app"
echo "    Password: admin@1403"
echo ""
echo "Android app: Open android/ in Android Studio and run on emulator"
echo ""
