# Quickstart: Hono + Inversify API

## Prerequisites

- Node.js 22+
- PostgreSQL (running via Docker)
- npm

## Setup

1. **Install Dependencies**:
   ```bash
   cd packages/api
   npm install
   ```

2. **Environment Variables**:
   Ensure `.env` contains:
   ```
   DATABASE_URL="postgresql://..."
   BETTER_AUTH_SECRET="your-secret"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

3. **Database Migration**:
   ```bash
   # From root
   cd packages/database
   npx prisma migrate dev
   ```

## Running the Server

### Development

```bash
# From root
nx serve api
# OR
cd packages/api && npm run dev
```

Server starts at `http://localhost:3000`.

## Testing

### Run Tests

```bash
cd packages/api
npm test
```

### Health Check

```bash
curl http://localhost:3000/health
```

### Authentication

**Login**:
```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@bakery.ru", "password": "password"}'
```
*Note: Better Auth endpoints might differ slightly based on configuration.*

