# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A bakery website monorepo with three apps: NestJS API backend, React admin panel, and Astro public website. Uses Turbo for build orchestration and npm workspaces.

## Architecture

### Monorepo Structure
- **packages/api**: NestJS backend with JWT auth, Prisma ORM
- **packages/admin**: React SPA with TanStack Router/Query, Vite
- **packages/public**: Astro static site with React islands
- **packages/database**: Prisma schema and generated client (outputs to `node_modules/.prisma/client`)
- **packages/shared-types**: Shared TypeScript types
- **packages/utils**: Shared utility functions
- **packages/ui-shared**: Shared UI components

### Authentication Flow
- API uses JWT tokens (Passport + `@nestjs/jwt`) with 7-day expiration
- Admin frontend stores JWT in localStorage, adds to requests via `ky` hooks
- Auth guard in `router.tsx` redirects to `/login` if no token
- Protected routes use `JwtAuthGuard` from `packages/api/src/app/auth/guards`

### Database
- PostgreSQL via Docker Compose (port 5432)
- Prisma schema in `packages/database/prisma/schema.prisma`
- Generated client shared via monorepo - all packages import from `@baker/database`
- Main entities: User (with Role enum), Category (self-referential tree), Cake (pricing per kg/item), Order (with status workflow), FAQ, Gallery
- Seed script creates admin user (admin@bakery.ru) - run with `npm run db:seed` in database package

### API Structure
- Global prefix: `/api` (set in main.ts)
- CORS enabled for localhost:4200 (admin) and localhost:4321 (public)
- Global ValidationPipe with whitelist enabled
- Module structure: AppModule imports UsersModule and AuthModule
- Auth endpoints: POST `/api/auth/login` returns JWT token

### Admin Frontend
- TanStack Router for routing with type-safe routes
- TanStack Query for API state management (client in `lib/query-client.ts`)
- `ky` HTTP client with auth interceptor in `lib/api.ts`
- Vite proxy forwards `/api/*` to `http://localhost:3000` in dev
- UI components use Shadcn UI (Radix + Tailwind CSS)
- Path alias `@/*` maps to `src/*`

### Public Frontend
- Astro with React integration for interactive components
- Tailwind CSS via `@tailwindcss/vite` plugin
- Runs on port 4321 by default

## Common Commands

### Development
```bash
# Install dependencies (root)
npm install

# Start PostgreSQL
docker-compose up -d

# Database operations (run in packages/database/)
cd packages/database
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Run migrations
npx prisma studio            # Open database GUI
npm run db:seed              # Seed admin user

# Start dev servers (run from root)
turbo dev                    # Start all apps
cd packages/api && npm run dev       # API only (port 3000)
cd packages/admin && npm run dev     # Admin only (port 5173, proxies to 3000)
cd packages/public && npm run dev    # Public only (port 4321)
```

### Testing & Quality
```bash
# Lint and format (root)
npx biome check .            # Check all files
npx biome format --write .   # Format all files
turbo lint                   # Lint all packages

# Build
turbo build                  # Build all packages
```

### Database Workflow
1. Edit `packages/database/prisma/schema.prisma`
2. Run `npx prisma migrate dev` (creates migration + generates client)
3. If schema changes affect API, restart API dev server
4. Client is auto-generated to `node_modules/.prisma/client` (shared across monorepo)

## Important Notes

- **Prisma Client Location**: Generated client is at `node_modules/.prisma/client`, not `packages/database/generated`
- **API Compilation**: API uses SWC for fast compilation, outputs to `packages/api/dist`
- **Environment Variables**: Copy `.env.example` to `.env` before running. Required vars: `DATABASE_URL`, `JWT_SECRET`
- **Port Conflicts**: API runs on 3000, Admin dev on 5173 (not 4200 as README states), Public on 4321
- **Workspace References**: Packages reference each other as `@baker/*` (e.g., `@baker/database`, `@baker/shared-types`)
- **Docker Database**: Uses postgres:16-alpine, credentials in docker-compose.yml match .env.example
- **Code Quality**: Project uses Biome (not ESLint/Prettier), configured for 2-space indentation, double quotes

## Testing Individual Features

To test a specific API endpoint:
```bash
# Start API and database
docker-compose up -d
cd packages/database && npx prisma migrate dev && cd ../..
cd packages/api && npm run dev
```

To test admin features:
```bash
# Ensure API is running, then:
cd packages/admin && npm run dev
# Login with admin@bakery.ru (password from seed script)
```
