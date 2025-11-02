# Nginx Configurations

This directory contains Nginx configurations for the containerized services.

## Files

### admin.conf
Nginx configuration for the React admin application served by container on port 80.

**Features:**
- SPA routing (all requests fall back to index.html)
- Gzip compression
- 1-year cache for static assets
- Security headers

**Used in:** infra/docker/Dockerfile.admin

### public.conf
Nginx configuration for the Astro public site served by container on port 80.

**Features:**
- Static file serving
- 1-year cache for versioned assets (JS, CSS, images)
- 1-hour cache for JSON files
- No cache for HTML (always check for updates)
- Gzip compression
- Security headers

**Used in:** infra/docker/Dockerfile.public

## Important Notes

- These configs run **inside Docker containers** (admin and public services)
- They listen on port **80** inside the container
- The **VPS Nginx** (running on host) acts as a reverse proxy in front of these containers
- Traffic flow: Browser → VPS Nginx (port 80/443) → Container Nginx (port 80) → App

## VPS Nginx Reverse Proxy

The VPS Nginx configuration (at `/etc/nginx/sites-available/baker-website`) handles:
- HTTPS/SSL termination (Let's Encrypt)
- Routing to containers
- Security headers for the proxy layer

## How Docker Uses These

When building containers, these files are copied as default config:

```dockerfile
COPY infra/nginx/admin.conf /etc/nginx/conf.d/default.conf
```

This replaces the default Nginx config inside the container.

## Testing Locally

To test these configs locally:

```bash
# Start containers with docker-compose
docker compose -f infra/docker/docker-compose.prod.yml up

# Access services
curl http://localhost:3001  # Admin (served by admin.conf)
curl http://localhost:3002  # Public (served by public.conf)
```

## Customization

To modify cache headers or add new routes:

1. Edit the relevant `.conf` file
2. Rebuild the container: `docker compose build admin` (or public)
3. Restart: `docker compose up -d`

Changes apply without requiring server restart due to Nginx hot-reload.
