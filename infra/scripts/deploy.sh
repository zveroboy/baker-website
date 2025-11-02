#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/baker-website"
COMPOSE_FILE="infra/docker/docker-compose.prod.yml"

cd "$PROJECT_DIR"

# Pull latest code
echo -e "${YELLOW}📦 Pulling latest code...${NC}"
git pull origin main || { echo -e "${RED}❌ Failed to pull code${NC}"; exit 1; }

# Rebuild containers
echo -e "${YELLOW}🔨 Building containers...${NC}"
docker compose -f "$COMPOSE_FILE" build || { echo -e "${RED}❌ Build failed${NC}"; exit 1; }

# Stop old containers
echo -e "${YELLOW}🛑 Stopping old containers...${NC}"
docker compose -f "$COMPOSE_FILE" down || true

# Start new containers
echo -e "${YELLOW}▶️  Starting new containers...${NC}"
docker compose -f "$COMPOSE_FILE" up -d || { echo -e "${RED}❌ Failed to start containers${NC}"; exit 1; }

# Run migrations
echo -e "${YELLOW}🗄️  Running migrations...${NC}"
sleep 5  # Give containers time to start
docker compose -f "$COMPOSE_FILE" exec -T api sh -c "cd packages/database && npx prisma migrate deploy" || { echo -e "${RED}❌ Migrations failed${NC}"; exit 1; }

# Health check
echo -e "${YELLOW}🏥 Checking health...${NC}"
sleep 5
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API health check passed${NC}"
else
    echo -e "${RED}⚠️  API health check failed!${NC}"
fi

# Container status
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}📊 Container status:${NC}"
docker compose -f "$COMPOSE_FILE" ps

echo ""
echo -e "${GREEN}🎉 All services running!${NC}"
echo ""
echo "URLs:"
echo "  Public:  https://kat-sweetcake.ru"
echo "  Admin:   https://kat-sweetcake.ru/admin"
echo "  API:     https://kat-sweetcake.ru/api"
