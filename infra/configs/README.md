# Configuration Files

This directory contains configuration and environment variable examples for production deployment.

## Files

### .env.example
Template for environment variables required for production deployment.

**Usage:**
1. Copy this file to `.env` on your VPS
2. Fill in the actual values (especially secrets!)
3. Never commit the `.env` file to Git

**Critical Variables:**
- `DATABASE_URL` - Connection string to timeweb.cloud PostgreSQL
- `JWT_SECRET` - Secret key for JWT token signing (minimum 32 characters)

**Optional Variables:**
- `SENTRY_DSN` - Error tracking (Sentry)
- `CORS_ORIGINS` - Allowed origins for API requests

## Security Notes

### Storing Secrets Securely

**On VPS:**
```bash
# Create .env file with restricted permissions
touch /var/www/baker-website/.env
chmod 600 /var/www/baker-website/.env  # Only root can read
```

**Generating Secure Values:**

JWT Secret (64-char hex):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Database Password (strong):
```bash
openssl rand -base64 32
```

### What NOT to Do

❌ Don't commit `.env` to Git  
❌ Don't use weak passwords  
❌ Don't share secrets in logs  
❌ Don't put secrets in Docker images  
❌ Don't use default values in production  

### Environment-Specific Files

For different environments, create separate files:
```
infra/configs/.env.example      # Template (commit to git)
infra/configs/.env.prod         # Production (gitignored)
infra/configs/.env.staging      # Staging (gitignored)
```

## Loading Variables in Docker

The docker-compose file loads the `.env` file automatically:

```yaml
# infra/docker/docker-compose.prod.yml
services:
  api:
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
```

## Verification

Before deploying, verify all required variables are set:

```bash
# On VPS
cd /var/www/baker-website
source .env
echo "DATABASE_URL: ${DATABASE_URL:?Error: DATABASE_URL not set}"
echo "JWT_SECRET: ${JWT_SECRET:?Error: JWT_SECRET not set}"
```

## Backup of Credentials

Store credentials securely:
- Password manager (1Password, Bitwarden, etc.)
- Encrypted file backup
- Never in plain text files

Credentials should be stored separately from code!

## Troubleshooting

### Environment variables not loading
1. Verify `.env` exists in project root
2. Check Docker compose has access to file
3. Rebuild containers: `docker compose build`

### API fails to start
1. Check `DATABASE_URL` is correct
2. Verify `JWT_SECRET` is set and long enough
3. Check logs: `docker compose logs api`

### CORS errors
1. Verify `CORS_ORIGINS` in `.env`
2. Ensure admin/public domains are listed
3. Restart API: `docker compose restart api`
