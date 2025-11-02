# Deployment Guide: timeweb.cloud VPS + Docker

**Target Environment:** Production  
**Hosting Provider:** timeweb.cloud  
**Architecture:** VPS + Docker Compose  
**Timeline:** Sprint 4 (2-3 days)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [VPS Setup](#vps-setup)
3. [Server Preparation](#server-preparation)
4. [Docker Compose Configuration](#docker-compose-configuration)
5. [Database Setup](#database-setup)
6. [Nginx Reverse Proxy](#nginx-reverse-proxy)
7. [SSL Configuration](#ssl-configuration)
8. [Application Deployment](#application-deployment)
9. [Post-Deployment](#post-deployment)
10. [Troubleshooting](#troubleshooting)

---

## Overview
## Overview

This guide will help you deploy your personal website to production using:

- **Hosting**: [timeweb.cloud](https://timeweb.cloud) VPS (2GB RAM recommended)
- **Database**: timeweb.cloud Managed PostgreSQL
- **Architecture**: Docker Compose with 3 containers (API, Admin, Public)
- **Domain**: kat-sweetcake.ru
- **SSL**: Let's Encrypt (free, auto-renewal)
- **Observability**: UptimeRobot + Netdata + Docker logs (all free)

**Total Cost**: ~1,247₽/month (~$13/month)  
**Deployment Time**: 4-6 hours for first deployment  
**Difficulty**: Moderate (copy-paste most commands)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    kat-sweetcake.ru                     │
│                     (HTTPS/SSL)                         │
└────────────────────────┬────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │  Nginx  │  Reverse Proxy
                    │  (VPS)  │  + SSL Termination
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
   │  Admin  │     │   API   │     │ Public  │
   │ (React) │     │ (NestJS)│     │ (Astro) │
   │Container│     │Container│     │Container│
   └─────────┘     └────┬────┘     └─────────┘
                        │
                        │ DATABASE_URL
                        │
                   ┌────▼────────────┐
                   │   PostgreSQL    │
                   │ (Managed - TW)  │
                   │ Auto Backups    │
                   └─────────────────┘

Monitoring:
- UptimeRobot (external, free)
- Netdata (VPS, self-hosted)
- timeweb.cloud DB dashboard
```

### Quick Start Checklist

Before you begin, make sure you have:

- [ ] timeweb.cloud account created
- [ ] Domain `kat-sweetcake.ru` purchased and accessible
- [ ] SSH key pair generated (`ssh-keygen`)
- [ ] Git repository access
- [ ] 4-6 hours of focused time
- [ ] This guide open and ready to follow

**Ready? Let's deploy!** 🚀

---

## Prerequisites

### What You Need Before Starting

- [ ] timeweb.cloud account
- [ ] Domain name (purchased and accessible)
- [ ] SSH key pair (for secure VPS access)
- [ ] Git repository access
- [ ] Admin user credentials for seeding

### Local Tools

```bash
# Verify you have these installed locally:
ssh -V          # SSH client
git --version   # Git
node --version  # Node.js (for local testing)
```

---

## VPS Setup

### Step 1: Create VPS on timeweb.cloud

1. **Log in to timeweb.cloud panel**
   - Navigate to: https://timeweb.cloud/

2. **Create new VPS (Cloud Server)**
   - Click "Создать сервер" (Create Server)
   
3. **Choose Configuration**
   ```
   OS:           Ubuntu 24.04 LTS
   CPU:          2 vCPU
   RAM:          2 GB (minimum) - 4 GB recommended
   Disk:         20 GB SSD
   Location:     Choose closest to your users
   ```

4. **Pricing Estimate**
   - ~500-800₽/month (~$5-8 USD) for 2GB RAM
   - ~1000-1200₽/month (~$10-12 USD) for 4GB RAM

5. **Add SSH Key**
   - Generate if you don't have one:
     ```bash
     ssh-keygen -t ed25519 -C "your-email@example.com"
     cat ~/.ssh/id_ed25519.pub
     ```
   - Paste public key in timeweb.cloud panel

6. **Create Server**
   - Note the IP address assigned
   - Save root password (if provided)

### Step 2: Configure Domain DNS

Point your domain `kat-sweetcake.ru` to the VPS IP address:

```
# DNS Records (add these in your domain registrar):
Type    Name    Value               TTL
A       @       YOUR_VPS_IP         3600
A       www     YOUR_VPS_IP         3600
```

**Propagation time:** 5 minutes to 48 hours (usually ~1 hour)

**Check propagation:**
```bash
ping kat-sweetcake.ru
dig kat-sweetcake.ru
```

---

## Server Preparation

### Step 1: Initial Server Access

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Update system packages
apt update && apt upgrade -y
```

### Step 2: Install Docker

```bash
# Install Docker using official script
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Verify installation
docker --version
# Expected: Docker version 24.x.x or higher

# Enable Docker to start on boot
systemctl enable docker
systemctl start docker
```

### Step 3: Install Docker Compose

```bash
# Install Docker Compose plugin
apt install docker-compose-plugin -y

# Verify installation
docker compose version
# Expected: Docker Compose version v2.x.x
```

### Step 4: Install Additional Tools

```bash
# Install Nginx (reverse proxy)
apt install nginx -y

# Install Certbot (for SSL)
apt install certbot python3-certbot-nginx -y

# Install Git
apt install git -y

# Install Node.js (for building apps)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify Node.js
node --version  # Should be v20.x.x
npm --version   # Should be 10.x.x
```

### Step 5: Configure Firewall

```bash
# Install UFW (Uncomplicated Firewall)
apt install ufw -y

# Configure firewall rules
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh          # Port 22
ufw allow http         # Port 80
ufw allow https        # Port 443

# Enable firewall
ufw enable

# Check status
ufw status
```

### Step 6: Create Application Directory

```bash
# Create app directory
mkdir -p /var/www/baker-website
cd /var/www/baker-website

# Set permissions (we'll refine this later)
chmod 755 /var/www/baker-website
```

---

## Docker Compose Configuration

The production Docker Compose configuration is located in the new `infra/` folder for better organization.

**File Location:** `/var/www/baker-website/infra/docker/docker-compose.prod.yml`

All Dockerfiles and nginx configs are also organized in the infra folder:
```
infra/
├── docker/
│   ├── docker-compose.prod.yml    # Production compose file
│   ├── Dockerfile.api             # API container
│   ├── Dockerfile.admin           # Admin container  
│   ├── Dockerfile.public          # Public site container
│   └── .dockerignore              # Docker build exclusions
├── nginx/
│   ├── admin.conf                 # Admin app nginx config
│   └── public.conf                # Public site nginx config
└── scripts/
    ├── deploy.sh                  # Deployment automation
    └── backup.sh                  # Database backup script
```

### Production Docker Compose File

File: `infra/docker/docker-compose.prod.yml`

```yaml
version: '3.8'

services:
  # NestJS API
  api:
    build:
      context: ../..
      dockerfile: infra/docker/Dockerfile.api
    container_name: baker-api
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3000
    ports:
      - "3000:3000"
    networks:
      - baker-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  # React Admin App
  admin:
    build:
      context: ../..
      dockerfile: infra/docker/Dockerfile.admin
      args:
        VITE_API_URL: https://kat-sweetcake.ru/api
    container_name: baker-admin
    restart: unless-stopped
    ports:
      - "3001:80"
    networks:
      - baker-network
    depends_on:
      api:
        condition: service_healthy

  # Astro Public Site
  public:
    build:
      context: ../..
      dockerfile: infra/docker/Dockerfile.public
      args:
        PUBLIC_API_URL: https://kat-sweetcake.ru/api
    container_name: baker-public
    restart: unless-stopped
    ports:
      - "3002:80"
    networks:
      - baker-network

networks:
  baker-network:
    driver: bridge
```

**Note:** The `context: ../..` goes to the repository root, and Dockerfiles are referenced from there.

### Create Dockerfiles

The Dockerfiles are located in `/var/www/baker-website/infra/docker/` and should already exist from your repository. 

**They are already provided in the infra folder:**
- `infra/docker/Dockerfile.api`
- `infra/docker/Dockerfile.admin`
- `infra/docker/Dockerfile.public`

#### Dockerfile.api

Located at: `infra/docker/Dockerfile.api`

Uses Node 22 Alpine for builder stage, with multi-stage build to minimize final image size.

```dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files for root, api, and database packages
COPY package*.json ./
COPY turbo.json ./
COPY packages/api/package*.json ./packages/api/
COPY libs/database/package*.json ./libs/database/
COPY packages/database/package*.json ./packages/database/

# Install all dependencies
RUN npm ci

# Copy source code
COPY packages/api ./packages/api
COPY packages/database ./packages/database
COPY libs/database ./libs/database

# Generate Prisma Client and build
RUN cd packages/database && npm run build
RUN cd packages/api && npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy production files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/api/dist ./packages/api/dist
COPY --from=builder /app/packages/database ./packages/database

# Expose port
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "packages/api/dist/src/main.js"]
```

#### Dockerfile.admin

Located at: `infra/docker/Dockerfile.admin`

```dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/admin/package*.json ./packages/admin/
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/ui-shared/package*.json ./packages/ui-shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY packages/admin ./packages/admin
COPY packages/shared-types ./packages/shared-types
COPY packages/ui-shared ./packages/ui-shared

# Build admin app
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

RUN cd packages/admin && npm run build

# Production stage - Nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built files to nginx
COPY --from=builder /app/packages/admin/dist /usr/share/nginx/html

# Copy nginx config
COPY infra/nginx/admin.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Dockerfile.public

Located at: `infra/docker/Dockerfile.public`

```dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/public/package*.json ./packages/public/

# Install dependencies
RUN npm ci

# Copy source code
COPY packages/public ./packages/public

# Build public site
ARG PUBLIC_API_URL=http://localhost:3000/api
ENV PUBLIC_API_URL=$PUBLIC_API_URL

RUN cd packages/public && npm run build

# Production stage - Nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built files to nginx
COPY --from=builder /app/packages/public/dist /usr/share/nginx/html

# Copy nginx config
COPY infra/nginx/public.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### .dockerignore

Located at: `infra/docker/.dockerignore`

Excludes unnecessary files from Docker build context to speed up builds and reduce image size.

### Create Nginx Configs for Containers

The nginx configurations for the containerized services are located in `infra/nginx/` and are already provided:

**Files:**
- `infra/nginx/admin.conf` - Configuration for React admin SPA
- `infra/nginx/public.conf` - Configuration for Astro static site

See `infra/nginx/README.md` for detailed information about these configurations.

#### admin.conf

Located at: `infra/nginx/admin.conf`

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    # SPA routing - serve index.html for all non-file requests
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (JS, CSS, images)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

#### public.conf

Located at: `infra/nginx/public.conf`

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    # Static file serving
    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets with long expiry (1 year)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache API responses less aggressively (1 hour)
    location ~* \.(json)$ {
        expires 1h;
        add_header Cache-Control "public";
    }

    # Don't cache HTML files - always check for updates
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

**Note:** These configs run **inside Docker containers**, not on the VPS host. They're automatically copied during container builds.

### Create Environment File

Create `/var/www/baker-website/.env`:

```bash
# Database (timeweb.cloud managed PostgreSQL)
DATABASE_URL=postgresql://baker_user:YOUR_DB_PASSWORD@db-XXXXX.timeweb.cloud:5432/baker_website?sslmode=require

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=CHANGE_THIS_TO_RANDOM_64_CHAR_HEX

# Domain
DOMAIN=kat-sweetcake.ru
```

**IMPORTANT:** Replace placeholder values with actual values from your timeweb.cloud database!

```bash
# Generate strong password
openssl rand -base64 32

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Database Setup

### Using timeweb.cloud Managed PostgreSQL (Recommended)

We'll use [timeweb.cloud's managed PostgreSQL service](https://timeweb.cloud/services/postgresql) for better reliability and automatic backups.

**Benefits:**
- ✅ Automatic daily backups included
- ✅ Better performance (dedicated resources)
- ✅ Easy scaling
- ✅ TLS encryption by default
- ✅ No need to manage database server
- ✅ 99.98% uptime SLA

**Cost:** Starting at **207₽/month** (~$2/month) for Cloud DB 1/1/8 plan

### Step 1: Create PostgreSQL Database

1. **Log in to timeweb.cloud panel**
   - Navigate to: https://timeweb.cloud/

2. **Create Database**
   - Click "Базы данных" (Databases) in left menu
   - Click "Создать" (Create)
   - Choose PostgreSQL

3. **Select Configuration**
   ```
   Plan:         Cloud DB 1/2/20 (recommended)
                 1 CPU, 2GB RAM, 20GB disk
   Version:      PostgreSQL 16
   Replicas:     0 (can add later for HA)
   Location:     Same as your VPS
   ```
   
   **Cost:** 405₽/month (~$4/month)

4. **Configure Database**
   - Database name: `baker_website`
   - Username: `baker_user` (or choose your own)
   - Strong password: Generate secure password

5. **Enable TLS** (if not enabled by default)
   - In database settings, enable TLS encryption

6. **Note Connection Details**
   ```
   Host:     db-XXXXX.timeweb.cloud
   Port:     5432
   Database: baker_website
   User:     baker_user
   Password: [your-secure-password]
   
   Full connection string:
   postgresql://baker_user:[password]@db-XXXXX.timeweb.cloud:5432/baker_website?sslmode=require
   ```

### Step 2: Update docker-compose.yml

Since we're using managed PostgreSQL, we need to remove the containerized database:

**Updated docker-compose.yml** (without postgres service):

```yaml
version: '3.8'

services:
  # NestJS API
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    container_name: baker-api
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3000
    ports:
      - "3000:3000"
    networks:
      - baker-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # React Admin App
  admin:
    build:
      context: .
      dockerfile: Dockerfile.admin
    container_name: baker-admin
    restart: unless-stopped
    environment:
      VITE_API_URL: https://kat-sweetcake.ru/api
    ports:
      - "3001:80"
    networks:
      - baker-network

  # Astro Public Site
  public:
    build:
      context: .
      dockerfile: Dockerfile.public
    container_name: baker-public
    restart: unless-stopped
    environment:
      PUBLIC_API_URL: https://kat-sweetcake.ru/api
    ports:
      - "3002:80"
    networks:
      - baker-network

networks:
  baker-network:
    driver: bridge
```

### Step 3: Update Environment Variables

Update `/var/www/baker-website/.env`:

```bash
# Database (timeweb.cloud managed PostgreSQL)
DATABASE_URL=postgresql://baker_user:YOUR_DB_PASSWORD@db-XXXXX.timeweb.cloud:5432/baker_website?sslmode=require

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=CHANGE_THIS_TO_RANDOM_64_CHAR_HEX

# Domain
DOMAIN=kat-sweetcake.ru
```

---

## Nginx Reverse Proxy

Create `/etc/nginx/sites-available/baker-website`:

```nginx
# HTTP - Will redirect to HTTPS after SSL setup
server {
    listen 80;
    listen [::]:80;
    server_name kat-sweetcake.ru www.kat-sweetcake.ru;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect to HTTPS (will add after SSL)
    # location / {
    #     return 301 https://$server_name$request_uri;
    # }

    # Temporary routes before SSL
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /admin {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable the site:**

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/baker-website /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## SSL Configuration

### Step 1: Obtain SSL Certificate

```bash
# Make sure domain points to your VPS first!
# Test with: ping kat-sweetcake.ru

# Obtain certificate
certbot --nginx -d kat-sweetcake.ru -d www.kat-sweetcake.ru

# Follow prompts:
# - Enter email address
# - Agree to Terms of Service
# - Choose redirect option (recommended)
```

### Step 2: Verify SSL

```bash
# Check certificate
certbot certificates

# Test auto-renewal
certbot renew --dry-run
```

### Step 3: Update Nginx Config for HTTPS

After Certbot runs, it will automatically update your Nginx config. Verify it looks like this:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name kat-sweetcake.ru www.kat-sweetcake.ru;

    # Redirect to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name kat-sweetcake.ru www.kat-sweetcake.ru;

    # SSL certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/kat-sweetcake.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kat-sweetcake.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin
    location /admin {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Admin-specific headers
        add_header X-Frame-Options "DENY" always;
    }

    # Public site
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Application Deployment

### Step 1: Clone Repository

```bash
cd /var/www/baker-website

# Clone your repo (use HTTPS or SSH)
git clone https://github.com/yourusername/baker-website.git .

# Or if already cloned, pull latest
git pull origin main
```

### Step 2: Configure Environment Variables

```bash
# Edit .env file with real values
nano .env

# Make sure to set:
# - DB_PASSWORD (strong password)
# - JWT_SECRET (random hex)
# - DOMAIN (your actual domain)
```

### Step 3: Build and Start Containers

```bash
cd /var/www/baker-website

# Build images using the production docker-compose file from infra folder
# (first time will take 5-10 minutes)
docker compose -f infra/docker/docker-compose.prod.yml build

# Start services
docker compose -f infra/docker/docker-compose.prod.yml up -d

# Check status
docker compose -f infra/docker/docker-compose.prod.yml ps

# Expected output:
# NAME              STATUS              PORTS
# baker-api         Up 30 seconds       0.0.0.0:3000->3000/tcp
# baker-admin       Up 30 seconds       0.0.0.0:3001->80/tcp
# baker-public      Up 30 seconds       0.0.0.0:3002->80/tcp
```

### Step 4: Run Database Migrations

**Important:** Even though we're using timeweb.cloud managed PostgreSQL, we still need to create the database schema (tables, columns, etc.). The managed database is empty when first created.

```bash
# Run migrations from API container
# The API container connects to timeweb.cloud PostgreSQL via DATABASE_URL
docker compose -f infra/docker/docker-compose.prod.yml exec api sh -c "cd packages/database && npx prisma migrate deploy"

# Verify migrations were applied
docker compose -f infra/docker/docker-compose.prod.yml exec api sh -c "cd packages/database && npx prisma migrate status"
```

**What's happening:**
- API container connects to `db-XXXXX.timeweb.cloud` (your managed PostgreSQL)
- Prisma reads migration files from `packages/database/prisma/migrations/`
- Creates tables: `User`, `Faq`, etc. in the remote database
- Data is stored in timeweb.cloud, not in the container

### Step 5: Seed Database

**Why we seed:** The database now has tables, but no data. We need to create at least one admin user to log in.

```bash
# First, review your seed file to ensure it's production-appropriate
# Edit libs/database/prisma/seed.ts if needed

# Seed database (runs from container, connects to timeweb.cloud)
docker compose -f infra/docker/docker-compose.prod.yml exec api sh -c "cd packages/database && npm run db:seed"

# What this does:
# 1. Runs seed script inside API container
# 2. Script connects to timeweb.cloud PostgreSQL
# 3. Creates admin user and initial data
# 4. Data is stored in managed database (timeweb.cloud)
```

**Why run from container?**
- API container has Node.js, npm, Prisma Client already configured
- DATABASE_URL environment variable already set
- All dependencies already installed
- No need to set up local environment

### Step 6: Verify Services

```bash
# Check API health
curl http://localhost:3000/api/health
# Expected: {"status":"ok","timestamp":"..."}

# Check admin app
curl http://localhost:3001
# Expected: HTML response

# Check public site
curl http://localhost:3002
# Expected: HTML response

# Check logs
docker compose -f infra/docker/docker-compose.prod.yml logs -f api
docker compose -f infra/docker/docker-compose.prod.yml logs -f admin
docker compose -f infra/docker/docker-compose.prod.yml logs -f public
```

---

## Post-Deployment

### 1. Smoke Testing

```bash
# Test API endpoints
curl https://kat-sweetcake.ru/api/health
curl https://kat-sweetcake.ru/api/faq

# Test admin login (from browser)
# Navigate to: https://kat-sweetcake.ru/admin
# Try logging in with seeded admin credentials

# Test public site (from browser)
# Navigate to: https://kat-sweetcake.ru
# Navigate to: https://kat-sweetcake.ru/faq
```

### 2. Set Up Automatic Backups

#### Database Backups (timeweb.cloud Managed)

**Good news!** Your timeweb.cloud managed PostgreSQL already includes automatic daily backups. ✅

**What's included:**
- Automatic daily backups
- 7-day retention (configurable)
- Point-in-time recovery
- One-click restore from panel

**To verify backups:**
1. Log in to timeweb.cloud panel
2. Go to your PostgreSQL database
3. Check "Резервные копии" (Backups) section
4. Verify backup schedule is active

**Manual backup (if needed):**

Create `/root/backup-db.sh` for additional local backups:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/baker-website"
DB_HOST="db-XXXXX.timeweb.cloud"
DB_NAME="baker_website"
DB_USER="baker_user"
DB_PASSWORD="YOUR_DB_PASSWORD"
RETENTION_DAYS=7

# Create backup directory
mkdir -p $BACKUP_DIR

# Generate filename with timestamp
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql.gz"

# Perform backup
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > $BACKUP_FILE

# Delete old backups
find $BACKUP_DIR -name "backup-*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $BACKUP_FILE"
```

**Install PostgreSQL client tools:**

```bash
# Install pg_dump
apt install postgresql-client -y

# Make script executable
chmod +x /root/backup-db.sh

# Test it
/root/backup-db.sh
```

**Optional: Schedule additional backups**

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM (in addition to timeweb.cloud backups)
0 2 * * * /root/backup-db.sh >> /var/log/backup.log 2>&1
```

**Note:** With managed PostgreSQL, the built-in backups are usually sufficient. Local backups are optional for extra redundancy.

### 3. Set Up Observability & Monitoring

We'll implement a simple, lightweight observability stack that gives you everything you need without complexity.

#### A. Uptime Monitoring with UptimeRobot (Free)

Monitor your site availability from multiple locations worldwide.

1. **Create free account:** https://uptimerobot.com
2. **Add monitors:**
   - Monitor 1: `https://kat-sweetcake.ru` (HTTP(s), every 5 min)
   - Monitor 2: `https://kat-sweetcake.ru/api/health` (HTTP(s), every 5 min)
   - Monitor 3: `https://kat-sweetcake.ru/admin` (Keyword, every 5 min)
3. **Configure alerts:**
   - Email notifications when site goes down
   - SMS alerts (optional, paid feature)
4. **Public status page:** Optional - create a status page to share

**Why:** Get instant alerts if your site goes down. Free tier includes 50 monitors with 5-minute checks.

#### B. Server Monitoring with Netdata (Free, Self-hosted)

Real-time performance monitoring for your VPS.

```bash
# Install Netdata
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Access dashboard
# http://YOUR_VPS_IP:19999 (local network only)
```

**Secure Netdata with Nginx reverse proxy:**

Add to your Nginx config:

```nginx
# In /etc/nginx/sites-available/baker-website
# Add this location block inside the HTTPS server block

location /netdata/ {
    proxy_pass http://localhost:19999/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    
    # Basic auth for security
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

**Create password file:**

```bash
# Install apache2-utils for htpasswd
apt install apache2-utils -y

# Create password (replace 'admin' with your username)
htpasswd -c /etc/nginx/.htpasswd admin

# Reload Nginx
systemctl reload nginx
```

**Access:** `https://kat-sweetcake.ru/netdata/`

**What you'll see:**
- CPU, RAM, disk usage in real-time
- Network traffic
- Docker container metrics
- System load and processes

#### C. Application Logs with Docker & Journald (Built-in, Free)

Centralized logging for all your containers.

```bash
# View all container logs
docker compose -f infra/docker/docker-compose.prod.yml logs -f

# View specific service logs
docker compose -f infra/docker/docker-compose.prod.yml logs -f api
docker compose -f infra/docker/docker-compose.prod.yml logs -f admin
docker compose -f infra/docker/docker-compose.prod.yml logs -f public

# View last 100 lines
docker compose -f infra/docker/docker-compose.prod.yml logs --tail 100 api

# View logs with timestamps
docker compose -f infra/docker/docker-compose.prod.yml logs -f -t api

# Follow logs from specific time
docker compose -f infra/docker/docker-compose.prod.yml logs --since 30m api

# Export logs to file for analysis
docker compose -f infra/docker/docker-compose.prod.yml logs --no-color > /var/log/baker-website-$(date +%Y%m%d).log
```

**Set up log rotation** (already configured in post-deployment section).

#### D. Simple Metrics Dashboard (Optional)

Create a simple health check endpoint in your API that returns metrics:

**Add to your NestJS API** (`apps/api/src/health/health.controller.ts`):

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import * as os from 'os';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
  }

  @Public()
  @Get('metrics')
  getMetrics() {
    return {
      timestamp: new Date().toISOString(),
      process: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
      system: {
        platform: os.platform(),
        cpus: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        loadAverage: os.loadavg(),
      },
    };
  }
}
```

**Monitor this endpoint:**
- Add `https://kat-sweetcake.ru/api/health/metrics` to UptimeRobot
- Check metrics manually: `curl https://kat-sweetcake.ru/api/health/metrics`

#### E. Error Tracking with Sentry (Optional, Free Tier)

Professional error tracking and performance monitoring.

**Free tier:** 5,000 errors/month, 10,000 performance units/month

**Setup:**

1. **Create account:** https://sentry.io
2. **Create new project:** Choose Node.js
3. **Install Sentry:**

```bash
# Add to your API package
cd packages/api
npm install @sentry/nestjs @sentry/profiling-node
```

4. **Configure in your API** (`apps/api/src/main.ts`):

```typescript
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// Initialize Sentry before creating the app
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  profilesSampleRate: 0.1,
  integrations: [nodeProfilingIntegration()],
});

// ... rest of your main.ts
```

5. **Add SENTRY_DSN to .env:**

```bash
# .env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id
```

6. **Rebuild and redeploy:**

```bash
docker compose -f infra/docker/docker-compose.prod.yml build api
docker compose -f infra/docker/docker-compose.prod.yml up -d api
```

**What you get:**
- Automatic error capturing
- Performance monitoring
- Release tracking
- User context
- Breadcrumbs (logs leading to errors)

#### F. Database Monitoring (Built-in with timeweb.cloud)

Your managed PostgreSQL includes built-in monitoring:

1. **Access timeweb.cloud panel**
2. **Go to your database**
3. **View metrics:**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Connection count
   - Query performance
   - Slow query log

**No setup needed!** Already included with managed database.

#### Summary: Your Observability Stack

```
┌─────────────────────────────────────────────┐
│        OBSERVABILITY ARCHITECTURE           │
├─────────────────────────────────────────────┤
│                                             │
│  Uptime Monitoring                          │
│  └─ UptimeRobot (Free)                      │
│     └─ Monitors site availability           │
│     └─ Email/SMS alerts                     │
│                                             │
│  Server Monitoring                          │
│  └─ Netdata (Free, Self-hosted)             │
│     └─ Real-time metrics                    │
│     └─ CPU, RAM, Disk, Network              │
│                                             │
│  Application Logs                           │
│  └─ Docker logs + Journald (Built-in)       │
│     └─ Centralized container logs           │
│     └─ Log rotation configured              │
│                                             │
│  Database Monitoring                        │
│  └─ timeweb.cloud dashboard (Built-in)      │
│     └─ Performance metrics                  │
│     └─ Slow query log                       │
│                                             │
│  Error Tracking (Optional)                  │
│  └─ Sentry (Free tier)                      │
│     └─ Error capturing                      │
│     └─ Performance monitoring               │
│                                             │
└─────────────────────────────────────────────┘
```

**Total Cost:** **FREE** (Sentry optional but has generous free tier)

**Setup Time:** ~30-60 minutes

**What You'll Know:**
- ✅ Is my site up or down?
- ✅ How much CPU/RAM is being used?
- ✅ Are there any errors in my application?
- ✅ How is the database performing?
- ✅ What's the response time of my API?

### 4. Set Up Log Rotation

Create `/etc/logrotate.d/baker-website`:

```
/var/www/baker-website/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    sharedscripts
    postrotate
        docker compose -f /var/www/baker-website/docker-compose.yml restart
    endscript
}
```

### 5. Deployment Script

A deployment script is already provided in `/var/www/baker-website/infra/scripts/deploy.sh`

**File Location:** `infra/scripts/deploy.sh`

This script:
1. Pulls latest code from git
2. Builds Docker images
3. Stops old containers
4. Starts new containers
5. Runs database migrations
6. Performs health checks

**To use the deployment script:**

```bash
# Copy it to a convenient location (if desired)
cp /var/www/baker-website/infra/scripts/deploy.sh /var/www/baker-website/deploy.sh
chmod +x /var/www/baker-website/deploy.sh

# Or run directly from infra folder:
cd /var/www/baker-website && ./infra/scripts/deploy.sh

# Or create a symlink:
ln -s /var/www/baker-website/infra/scripts/deploy.sh /var/www/baker-website/deploy.sh
```

**For future deployments:**

```bash
# Simple: Run the script
cd /var/www/baker-website && ./deploy.sh

# Or with direct path:
/var/www/baker-website/infra/scripts/deploy.sh
```

The script automatically handles:
- Code updates
- Container rebuilds
- Migrations
- Health verification

---

## Troubleshooting

### Container Issues

```bash
# View all containers
docker compose -f infra/docker/docker-compose.prod.yml ps

# View logs
docker compose -f infra/docker/docker-compose.prod.yml logs -f                    # All services
docker compose -f infra/docker/docker-compose.prod.yml logs -f api               # Just API
docker compose -f infra/docker/docker-compose.prod.yml logs -f api --tail 100    # Last 100 lines

# Restart a service
docker compose -f infra/docker/docker-compose.prod.yml restart api

# Rebuild a service
docker compose -f infra/docker/docker-compose.prod.yml build api
docker compose -f infra/docker/docker-compose.prod.yml up -d api

# Access container shell
docker compose -f infra/docker/docker-compose.prod.yml exec api sh
docker compose -f infra/docker/docker-compose.prod.yml exec admin sh
docker compose -f infra/docker/docker-compose.prod.yml exec public sh
```

### Database Issues

```bash
# Check database connection from VPS
PGPASSWORD=YOUR_DB_PASSWORD psql -h db-XXXXX.timeweb.cloud -U baker_user -d baker_website -c "SELECT 1;"

# View tables
PGPASSWORD=YOUR_DB_PASSWORD psql -h db-XXXXX.timeweb.cloud -U baker_user -d baker_website -c "\dt"

# Check connection from API container
docker compose -f infra/docker/docker-compose.prod.yml exec api sh -c "cd packages/database && npx prisma db execute --stdin <<< 'SELECT 1;'"

# View database metrics in timeweb.cloud panel
# Go to: https://timeweb.cloud/ → Databases → Your Database → Metrics

# Reset database (DANGER - deletes all data!)
# 1. Drop and recreate database in timeweb.cloud panel, OR:
# 2. Run migrations reset (will delete all data):
docker compose -f infra/docker/docker-compose.prod.yml exec api sh -c "cd packages/database && npx prisma migrate reset --force"
```

### Nginx Issues

```bash
# Test configuration
nginx -t

# View error logs
tail -f /var/log/nginx/error.log

# Reload configuration
systemctl reload nginx

# Restart Nginx
systemctl restart nginx
```

### SSL Issues

```bash
# Check certificate status
certbot certificates

# Renew certificate manually
certbot renew

# Test renewal
certbot renew --dry-run

# Force renewal
certbot renew --force-renewal
```

### Port Conflicts

```bash
# Check what's using a port
netstat -tulpn | grep :3000
lsof -i :3000

# Kill process using a port
kill -9 PID
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Docker cleanup
docker system prune -a              # Remove unused images
docker volume prune                 # Remove unused volumes

# Clean logs
journalctl --vacuum-time=7d        # Keep only 7 days of logs
```

### Performance Issues

```bash
# Check resource usage
htop                               # Interactive process viewer
docker stats                       # Container resource usage

# Check memory
free -h

# Check CPU
top
```

---

## Quick Reference

### Essential Commands

```bash
# Start all services
docker compose -f infra/docker/docker-compose.prod.yml up -d

# Stop all services
docker compose -f infra/docker/docker-compose.prod.yml down

# Restart service
docker compose -f infra/docker/docker-compose.prod.yml restart api

# View logs
docker compose -f infra/docker/docker-compose.prod.yml logs -f api

# Deploy updates
cd /var/www/baker-website && ./deploy.sh

# Backup database
/root/backup-db.sh

# SSH into VPS
ssh root@YOUR_VPS_IP
```

### Important Files

```
/var/www/baker-website/              # Application root
├── docker-compose.yml               # Service orchestration
├── .env                             # Environment variables (SECRET!)
├── deploy.sh                        # Deployment script
├── Dockerfile.api                   # API container
├── Dockerfile.admin                 # Admin container
├── Dockerfile.public                # Public site container
└── nginx/                           # Container Nginx configs

/etc/nginx/sites-available/          # Nginx configs
/var/log/nginx/                      # Nginx logs
/var/backups/baker-website/          # Database backups
/root/backup-db.sh                   # Backup script
```

### Port Mapping

```
80   → Nginx (HTTP)
443  → Nginx (HTTPS)
3000 → API (internal)
3001 → Admin (internal)
3002 → Public (internal)
5432 → PostgreSQL (internal)
```

### URLs

```
Production:
https://kat-sweetcake.ru              # Public site
https://kat-sweetcake.ru/admin        # Admin panel
https://kat-sweetcake.ru/api          # API
https://kat-sweetcake.ru/netdata/     # Server monitoring (password protected)

Health checks:
https://kat-sweetcake.ru/api/health           # API health
https://kat-sweetcake.ru/api/health/metrics   # API metrics
```

---

## Security Checklist

- [ ] Strong database password set
- [ ] Strong JWT secret set (64 chars)
- [ ] Firewall (UFW) enabled and configured
- [ ] SSL certificate installed and auto-renewal working
- [ ] Security headers configured in Nginx
- [ ] Environment variables in .env (not committed to git)
- [ ] SSH key-based authentication (no password login)
- [ ] Regular security updates enabled
- [ ] Backups configured and tested
- [ ] Monitoring set up (UptimeRobot)

---

## Cost Estimate

```
VPS (2-4GB RAM):        500-1200₽/month  (~$5-12/month)
Managed PostgreSQL:     405-810₽/month   (~$4-8/month)
Domain (.ru):           ~500₽/year       (~$5/year)
Uptime Monitoring:      Free (UptimeRobot)
Server Monitoring:      Free (Netdata, self-hosted)
Error Tracking:         Free (Sentry free tier, optional)
SSL:                    Free (Let's Encrypt)
CDN:                    Free (Cloudflare, optional)

Monthly Total:          ~905-2010₽/month (~$9-20/month)
Annual Total:           ~11,360-24,620₽/year (~$115-250/year)

Recommended Starter Setup:
- VPS 2GB:              ~800₽/month
- PostgreSQL 1/2/20:    405₽/month
- Domain:               ~500₽/year (~42₽/month)
= ~1247₽/month (~$13/month)
```

**All observability tools included are FREE!** 🎉

---

## Next Steps After Deployment

1. **Monitor for 24-48 hours** - Check logs, uptime, errors
2. **Test all functionality** - Login, CRUD operations, public pages
3. **Run Lighthouse audit** - Optimize performance
4. **Set up CI/CD** (Optional) - Automate deployments with GitHub Actions
5. **Add analytics** (Optional) - Google Analytics, Plausible, etc.
6. **Document any issues** - Update this guide with solutions

---

## Support

### Helpful Resources

- timeweb.cloud docs: https://timeweb.cloud/help
- Docker docs: https://docs.docker.com
- Nginx docs: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/docs/

### Getting Help

If you run into issues:
1. Check logs first (`docker compose -f infra/docker/docker-compose.prod.yml logs`)
2. Search error messages online
3. Check timeweb.cloud support
4. Review this troubleshooting section

---

**Last Updated:** Sprint 4  
**Maintainer:** Baker Website Team  
**VPS IP:** YOUR_VPS_IP (update after VPS creation)  
**Domain:** kat-sweetcake.ru
**Database:** timeweb.cloud Managed PostgreSQL
**Hosting:** timeweb.cloud VPS + Docker

