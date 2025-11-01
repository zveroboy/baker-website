# Baker Personal Website

A modern bakery website with public storefront and admin panel built with Nx monorepo.

## Prerequisites

- Node.js 20+ 
- npm
- Docker and Docker Compose (for PostgreSQL)

## Quick Start

1. **Fix npm cache permissions (if needed):**
   ```bash
   sudo chown -R $(id -u):$(id -g) ~/.npm
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Run database migrations:**
   ```bash
   cd libs/database
   npx prisma migrate dev
   ```

5. **Start development servers:**
   ```bash
   # API (port 3000)
   nx serve api
   
   # Admin (port 4200)
   nx serve admin
   
   # Public (port 4321)
   nx run public:dev
   ```

## Available Apps

- **API**: NestJS backend (`nx serve api`)
- **Admin**: React admin panel (`nx serve admin`)
- **Public**: Astro public website (`nx run public:dev`)

## Database

The database schema is managed with Prisma in `libs/database`.

```bash
# Generate Prisma client
cd libs/database && npx prisma generate

# Run migrations
cd libs/database && npx prisma migrate dev

# Open Prisma Studio
cd libs/database && npx prisma studio
```

## Development

### Code Quality

- Lint code with Biome: `npx biome check .`
- Format code with Biome: `npx biome format --write .`
- Lint all projects: `nx run-many --target=lint --all`
- Run tests: `nx run-many --target=test --all`
- Build all: `nx run-many --target=build --all`

## Project Structure

```
baker-personal-website/
├── apps/
│   ├── api/          # NestJS API
│   ├── admin/         # React admin panel
│   └── public/        # Astro public site
├── libs/
│   ├── database/      # Prisma schema and client
│   ├── shared-types/  # Shared TypeScript types
│   ├── utils/         # Shared utilities
│   └── ui-shared/     # Shared UI components
└── specs/             # Project documentation
```

## Tech Stack

- **Monorepo**: Nx
- **Backend**: NestJS, Prisma, PostgreSQL
- **Admin Frontend**: React, Vite, Tailwind CSS, Shadcn UI
- **Public Frontend**: Astro, React, Tailwind CSS, Shadcn UI
- **Code Quality**: Biome, Husky

