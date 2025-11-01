# Sprint 2 Backend - Completed ✅

## What's Implemented

### Database
- ✅ Admin user seeded: `admin@bakery.ru` / `admin123`
- ✅ Using `tsx` (SWC-based) for Prisma seed script

### NestJS Modules
- ✅ **UsersModule**: User lookup by email
- ✅ **AuthModule**: Complete JWT authentication
- ✅ All modules with `index.ts` for proper encapsulation

### Authentication
- ✅ **AuthService**:
  - `validateUser()` - bcrypt password validation
  - `login()` - JWT token generation (7 days expiry)
- ✅ **JwtStrategy**: Token validation
- ✅ **JwtAuthGuard**: Route protection

### API Endpoints
- ✅ `POST /api/auth/login` - Login with email/password
- ✅ `GET /api/auth/me` - Get current user (protected)
- ✅ `POST /api/auth/validate` - Validate token (protected)
- ✅ `GET /api/health` - Health check

### Configuration
- ✅ SWC compiler with decorator metadata support (`.swcrc`)
- ✅ Global validation pipe
- ✅ `/api` prefix for all routes
- ✅ CORS enabled for admin and public apps
- ✅ `reflect-metadata` imported

## Running the API

### Option 1: Using nx serve (recommended for development)
```bash
npx nx serve api
```

**Note**: If you get "Build failed, waiting for changes", the app is actually running! 
The serve executor has a quirk but the API works fine.

### Option 2: Run built code directly
```bash
# Build first
npx nx build api

# Install deps in dist
cd dist/apps/api && npm install

# Run
cd dist/apps/api && node src/main.js
```

## Testing

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bakery.ru","password":"admin123"}'
```

**Response:**
```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": "...",
    "email": "admin@bakery.ru",
    "name": "Admin",
    "role": "ADMIN"
  }
}
```

### 2. Get Current User (Protected)
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "id": "...",
  "email": "admin@bakery.ru",
  "name": "Admin",
  "role": "ADMIN",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Key Technical Decisions

### Why SWC instead of esbuild?
- esbuild doesn't support `emitDecoratorMetadata`
- NestJS requires decorator metadata for dependency injection
- SWC supports it with proper `.swcrc` configuration

### Why tsx instead of ts-node?
- Faster (SWC-based)
- Aligns with our SWC build stack
- Modern alternative

### Prisma Client Usage
- Using singleton `prisma` instance from `@baker/database`
- Prevents multiple Prisma client instances
- Shared across all services

## Next: Frontend Implementation

Sprint 2 backend is complete. Ready for frontend:
1. Install TanStack Query, axios, react-router-dom
2. Generate login form with v0.dev
3. Create auth hooks and protected routes
4. Wire it all up

See `specs/init/SPRINT_2_PLAN.yaml` for frontend plan.

