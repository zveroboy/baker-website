#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/baker-website"
DB_HOST="${DB_HOST:-db-XXXXX.timeweb.cloud}"
DB_NAME="${DB_NAME:-baker_website}"
DB_USER="${DB_USER:-baker_user}"
DB_PASSWORD="${DB_PASSWORD:-}"
RETENTION_DAYS=${RETENTION_DAYS:-7}

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate filename with timestamp
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql.gz"

echo -e "${YELLOW}🔄 Starting database backup...${NC}"
echo "Database: $DB_NAME @ $DB_HOST"
echo "Output: $BACKUP_FILE"

# Check if password is set
if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ Error: DB_PASSWORD not set${NC}"
    exit 1
fi

# Perform backup
if PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" | gzip > "$BACKUP_FILE"; then
    # Get backup file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✅ Backup completed: $SIZE${NC}"
    echo "File: $BACKUP_FILE"
else
    echo -e "${RED}❌ Backup failed!${NC}"
    rm -f "$BACKUP_FILE"
    exit 1
fi

# Delete old backups
echo -e "${YELLOW}🧹 Cleaning up old backups (older than $RETENTION_DAYS days)...${NC}"
DELETED=$(find "$BACKUP_DIR" -name "backup-*.sql.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)
echo -e "${GREEN}✅ Deleted $DELETED old backup(s)${NC}"

# List recent backups
echo ""
echo -e "${YELLOW}📋 Recent backups:${NC}"
ls -lh "$BACKUP_DIR" | tail -5
