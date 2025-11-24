# Feature Specification: Migrate to Hono + Inversify

**Feature Branch**: `001-migrate-hono-inversify`  
**Created**: 2025-11-23  
**Status**: Draft  
**Input**: User description: "Migrate to hono+inversify framework (https://inversify.io/framework/docs/introduction/getting-started/ ) instead of nest.js because it is a small project. Check turborepo example hono+next.js https://github.com/vercel/examples/tree/main/starter/turborepo-with-hono"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - System Health & Configuration (Priority: P1)

As a developer, I want the basic Hono server running with Inversify DI, CORS, and Health Checks, so that the foundational infrastructure is in place.

**Why this priority**: This establishes the replacement framework and proves the technology stack works in the monorepo before migrating business logic.

**Independent Test**: Can start the server, request `GET /health` and receive 200 OK. Can verify CORS headers.

**Acceptance Scenarios**:

1. **Given** the API server is running, **When** I request `GET /health`, **Then** I receive a JSON response with status "ok".
2. **Given** the API server is running, **When** I make a request from `http://localhost:4321`, **Then** CORS headers allow the request.
3. **Given** the server starts, **When** I inspect the logs, **Then** I see the server listening on port 3000.

---

### User Story 2 - Authentication System Migration (Priority: P1)

As a user, I want to log in using the new Better Auth system, so that I can access protected resources with secure session management.

**Why this priority**: Authentication is critical for the Admin panel and Better Auth simplifies the implementation compared to the previous custom NestJS strategy.

**Independent Test**: Can POST credentials to `/api/auth/login` (or Better Auth equivalent) and receive a valid session/token.

**Acceptance Scenarios**:

1. **Given** valid user credentials, **When** I login via Better Auth endpoint, **Then** I receive a valid session/token.
2. **Given** invalid credentials, **When** I attempt login, **Then** I receive a 401 Unauthorized response.
3. **Given** a protected route, **When** I request it without a session, **Then** I receive a 401/403 error.

---

### User Story 3 - Users & Data Migration (Priority: P2)

As an admin, I want to manage users via the API, so that I can maintain the system users.

**Why this priority**: Completes the feature parity for the existing modules (UsersModule).

**Independent Test**: Can CRUD users via the new API endpoints.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** I request `GET /api/users`, **Then** I receive a list of users.
2. **Given** an authenticated admin, **When** I request `GET /api/users/profile`, **Then** I receive my own profile data.

---

### Edge Cases

- What happens when the database connection is lost? (Should return 500)
- How does system handle malformed JSON? (Zod validation middleware)
- How does DI container handle circular dependencies? (Should not exist, but Inversify handles this differently than Nest)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST use Hono as the HTTP server framework.
- **FR-002**: System MUST use InversifyJS for dependency injection container.
- **FR-003**: System MUST use **Zod** for DTO validation (replacing Class Validator).
- **FR-004**: System MUST expose all endpoints under the `/api` global prefix.
- **FR-005**: System MUST use **Better Auth** library for authentication, replacing custom NestJS strategies.
- **FR-006**: System MUST support CORS for defined origins (`localhost:4200`, `localhost:4321`).

### Key Entities *(include if feature involves data)*

- **User**: System users with roles (Better Auth Schema).
- **Session**: Auth sessions (Better Auth Schema).
- **Auth**: Authentication tokens and payloads.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of existing Postman/E2E tests (if any) pass against the new implementation.
- **SC-002**: API startup time is less than 1000ms (cold start).
- **SC-003**: Bundle/Docker image size is reduced by at least 20% compared to NestJS build.
- **SC-004**: Zero regressions in Admin Panel or Public Website functionality during manual verification.
