# Implementation Plan: Migrate to Hono + Inversify

**Branch**: `001-migrate-hono-inversify` | **Date**: 2025-11-23 | **Spec**: [specs/001-migrate-hono-inversify/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-migrate-hono-inversify/spec.md`

## Summary

Migrate the existing NestJS `packages/api` to a lightweight stack using **Hono** (server), **InversifyJS** (DI), **Better Auth** (Authentication), and **Zod** (Validation). This aims to reduce bundle size, improve startup time, and simplify the architecture for a small-scale project.

## Technical Context

**Language/Version**: TypeScript 5+ (Node 22+)
**Primary Dependencies**: 
- `hono` (Server)
- `inversify`, `reflect-metadata` (DI)
- `@inversifyjs/http-core`, `@inversifyjs/http-hono` (DI <-> HTTP Adapter)
- `better-auth` (Authentication)
- `zod` (Validation)
- `@prisma/client` (Database)
**Storage**: PostgreSQL (via Prisma)
**Testing**: **Vitest**
**Target Platform**: Linux server (Docker)
**Project Type**: Monorepo (Nx/Turbo)
**Performance Goals**: <1s cold start, reduced bundle size
**Constraints**: Must preserve API contract for Admin and Public apps

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Code Quality**: Hono/Inversify allows strict patterns. Biome can be used.
- **II. Testing Standards**: Hono is highly testable with Vitest.
- **III. User Experience Consistency**: API contract preservation ensures UX doesn't change.
- **IV. Performance Requirements**: Migration directly targets performance (startup/size).
- **V. Monorepo & Architecture**: `packages/api` remains the boundary.

## Project Structure

### Documentation (this feature)

```text
specs/001-migrate-hono-inversify/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
packages/api/
├── src/
│   ├── app/
│   │   ├── auth/           # Better Auth configuration & endpoints
│   │   ├── users/          # Users controller & service
│   │   └── health/         # Health check
│   ├── lib/
│   │   ├── container.ts    # Inversify container setup
│   │   ├── types.ts        # DI Symbols
│   │   └── validation.ts   # Zod middleware
│   └── main.ts             # Entry point
├── test/                   # Integration tests
└── package.json
```

**Structure Decision**: Replace NestJS modules with Hono routes + Inversify services. Keep `packages/api` location.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| InversifyJS | Dependency Injection for testability | Manual wiring is harder to maintain as app grows |
| Better Auth | Robust Auth features | Rolling own Auth is error-prone and insecure |
