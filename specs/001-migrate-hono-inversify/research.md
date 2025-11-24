# Research: Hono + Inversify + Better Auth + Zod Stack

**Context**: Migrating a NestJS API to Hono + Inversify with Better Auth for authentication and Zod for validation.

## Authentication: Better Auth vs NestJS JWT

**Decision**: Use **Better Auth** with Hono adapter.
**Rationale**:
- **Type Safety**: Better Auth provides end-to-end type safety.
- **Capabilities**: Includes built-in session management, OAuth providers, and plugin system (2FA, etc.) out of the box, reducing boilerplate compared to manual JWT strategies in NestJS.
- **Integration**: Has official Hono adapter and can be registered in Inversify container (via `inversify-express-utils` style or custom binding).
- **Docs**: https://www.better-auth.com/docs/introduction
- **Schema**: Requires specific database schema (User, Session, Account, Verification). Will need to migrate existing Prisma schema.

**Migration Strategy**:
- Existing `User` table has `email`, `password`, `role`.
- Better Auth `User` table requires specific fields (`id`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt`).
- **Plan**: Extend Better Auth schema with `role` field.
- **Token**: Better Auth handles session management. Can configured to use JWT or Database Sessions. Using **Bearer Tokens** (stateless or database backed) is possible.

## Validation: Zod

**Decision**: Use **Zod** with `zod-validator` middleware for Hono.
**Rationale**:
- **Standard**: Zod is the de-facto standard for TS validation.
- **Hono Integration**: `hono-zod-validator` or built-in validator is lightweight.
- **Runtime**: Faster than `class-validator` (no decorators/reflection at runtime).

## Dependency Injection: InversifyJS

**Decision**: Use **InversifyJS** with **@inversifyjs/http-core** and **@inversifyjs/http-hono**.
**Rationale**:
- **Requirement**: User explicitly requested Inversify with the official HTTP framework integration.
- **Framework**: **@inversifyjs/http-hono** provides the adapter to bridge Hono and Inversify.
- **Pattern**: Use Controller-based architecture where controllers are decorated and automatically registered via the container.
- **Integration**:
  - Install: `inversify`, `reflect-metadata`, `@inversifyjs/http-core`, `@inversifyjs/http-hono`.
  - Setup: Create container, bind controllers, use `InversifyHonoHttpAdapter` to build the Hono application.
  - **Advantage**: Provides a structured, declarative way to define routes using decorators (like NestJS), easing the migration for developers familiar with that pattern.

## Testing

**Decision**: **Vitest**.
**Rationale**:
- Native support for ESM/TypeScript.
- Faster than Jest.
- Compatible with Hono testing helpers (`hono/testing`).

## Database

**Decision**: **Prisma**.
**Rationale**:
- Already used in project.
- Better Auth has a Prisma adapter.

## Unknowns Resolved

- **Testing**: Switched to Vitest.
- **DI Integration**: Will use manual resolution or lightweight wrapper in route handlers.
- **Auth Migration**: Will implement Better Auth Prisma schema and map existing users.


