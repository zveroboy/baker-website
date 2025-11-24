---
description: "Task list template for feature implementation"
---

# Tasks: Migrate to Hono + Inversify

**Input**: Design documents from `/specs/001-migrate-hono-inversify/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project structure and core dependencies.

- [ ] T001 Create feature branch `001-migrate-hono-inversify` (done)
- [ ] T002 [P] Install core dependencies in `packages/api`: `hono`, `inversify`, `reflect-metadata`, `@inversifyjs/http-core`, `@inversifyjs/http-hono`, `better-auth`, `zod`
- [ ] T003 [P] Install dev dependencies in `packages/api`: `vitest`, `supertest` (or hono testing utils), `@types/node`
- [ ] T004 Configure `packages/api/tsconfig.json` for Decorator support (`experimentalDecorators`, `emitDecoratorMetadata`)
- [ ] T005 Configure `packages/api/vite.config.ts` (or vitest config) for testing

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure needed before any user story.

**⚠️ CRITICAL**: Blocks all user stories.

- [ ] T006 Update Prisma Schema in `packages/database/prisma/schema.prisma` with Better Auth models (User, Session, Account, Verification)
- [ ] T007 Generate Prisma Client and run migration `npx prisma migrate dev --name better_auth_init`
- [ ] T008 Create Inversify Container setup in `packages/api/src/lib/container.ts`
- [ ] T009 Create DI Types/Symbols in `packages/api/src/lib/types.ts`
- [ ] T010 Configure Better Auth instance in `packages/api/src/lib/auth.ts` (or similar) with Prisma adapter
- [ ] T011 Create Hono App entry point in `packages/api/src/main.ts` using `InversifyHonoHttpAdapter`
- [ ] T012 Configure Global Zod Validation Middleware (or similar pipe mechanism)

**Checkpoint**: Server should start with empty container. Database schema is ready.

## Phase 3: User Story 1 - System Health & Configuration (Priority: P1) 🎯 MVP

**Goal**: Basic Hono server running with DI, CORS, and Health Checks.

**Independent Test**: `GET /health` returns 200 OK. CORS headers present.

- [ ] T013 [P] [US1] Create Health Controller in `packages/api/src/app/health/health.controller.ts` using `@controller` decorator
- [ ] T014 [US1] Bind Health Controller in `packages/api/src/lib/container.ts`
- [ ] T015 [US1] Configure CORS in `packages/api/src/main.ts` (allow `localhost:4200`, `localhost:4321`)
- [ ] T016 [US1] Add integration test for Health endpoint in `packages/api/test/health.spec.ts`
- [ ] T017 [US1] Verify server startup and port binding (3000)

**Checkpoint**: MVP infrastructure active.

## Phase 4: User Story 2 - Authentication System Migration (Priority: P1)

**Goal**: User login via Better Auth, JWT/Session issuance.

**Independent Test**: `POST /api/auth/sign-in/email` works.

- [ ] T018 [P] [US2] Create Auth Controller in `packages/api/src/app/auth/auth.controller.ts` (if wrapping Better Auth, otherwise configure Better Auth routes in main)
- [ ] T019 [US2] Configure Better Auth Email/Password provider
- [ ] T020 [US2] Create Zod Schemas for Login/Register in `packages/api/src/app/auth/auth.schema.ts`
- [ ] T021 [US2] Implement Auth Middleware (Guard) for protected routes in `packages/api/src/lib/guards/auth.guard.ts`
- [ ] T022 [US2] Add integration test for Login flow in `packages/api/test/auth.spec.ts`
- [ ] T023 [US2] Verify JWT/Session token generation and validation

**Checkpoint**: Auth system functional.

## Phase 5: User Story 3 - Users & Data Migration (Priority: P2)

**Goal**: User management endpoints.

**Independent Test**: `GET /api/users` works for admin.

- [ ] T024 [P] [US3] Create User Service in `packages/api/src/app/users/users.service.ts` (Interact with Prisma)
- [ ] T025 [P] [US3] Create User Controller in `packages/api/src/app/users/users.controller.ts`
- [ ] T026 [US3] Bind User Service and Controller in `packages/api/src/lib/container.ts`
- [ ] T027 [US3] Implement `GET /api/users` (Admin only - use Auth Guard)
- [ ] T028 [US3] Implement `GET /api/users/profile` (Authenticated user)
- [ ] T029 [US3] Add integration tests for User endpoints in `packages/api/test/users.spec.ts`

**Checkpoint**: User management feature complete.

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and final verification.

- [ ] T030 Remove old NestJS dependencies and unused files
- [ ] T031 Verify Bundle Size reduction (build check)
- [ ] T032 Update `CLAUDE.md` and `README.md` with new architecture details
- [ ] T033 Verify Admin Panel compatibility (manual check)

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all stories.
- **User Stories (Phase 3+)**: Depend on Foundational.
- **Polish**: Depends on all stories.

### Parallel Opportunities

- Setup tasks T002, T003 can run in parallel.
- In Phase 3, Health Controller (T013) and CORS config (T015) are mostly independent.
- In Phase 5, Service (T024) and Controller (T025) skeletons can be created in parallel.

## Implementation Strategy

### MVP First
1. Complete Setup & Foundational.
2. Implement US1 (Health/CORS).
3. Verify Server runs.

### Incremental Delivery
1. Add US2 (Auth).
2. Add US3 (Users).
3. Final Polish.

