---
description: "Task list template for feature implementation"
---

# Tasks: FAQ Management System

**Input**: Design documents from `/specs/002-faq-management/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included only where relevant for verifying functionality.
**Organization**: Tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- File paths are absolute relative to repo root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create feature directory structure `packages/api/src/modules/faq`, `packages/admin/src/features/faq`, `packages/public/src/app/faq`
- [ ] T002 [P] Install `@dnd-kit/core` and `@dnd-kit/sortable` in `packages/admin`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Update Prisma schema in `packages/database/prisma/schema.prisma` with `FAQ` model
- [ ] T004 Create migration and generate client (`npm run db:migrate` in packages/database)
- [ ] T005 [P] Create shared DTO types in `packages/shared-types/src/index.ts` (`FaqDto`, `CreateFaqDto`, etc.)
- [ ] T006 Implement `FaqRepository` in `packages/api/src/modules/faq/faq.repository.ts`
- [ ] T007 Implement `FaqService` base class in `packages/api/src/modules/faq/faq.service.ts`
- [ ] T008 Create `FaqController` structure in `packages/api/src/http/controllers/faq.controller.ts`
- [ ] T009 Register `FaqModule` in DI container `packages/api/src/lib/container.ts` and `main.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Public FAQ Access (Priority: P1) 🎯 MVP

**Goal**: Customers can view published FAQs on the public website.

**Independent Test**: Seed DB with published/unpublished FAQs, verify only published appear on public page.

### Implementation for User Story 1

- [ ] T010 [US1] Add `getPublicFaqs` method to `FaqService` (filtering by isPublished=true)
- [ ] T011 [US1] Add `GET /api/faqs` endpoint to `FaqController`
- [ ] T012 [US1] Create `Accordion` component in `packages/ui-shared/src/lib/accordion.tsx` (if not exists) or import from shadcn
- [ ] T013 [US1] Implement Public FAQ Page in `packages/public/src/app/faq/page.tsx` (fetch & render)

**Checkpoint**: User Story 1 fully functional.

---

## Phase 4: User Story 2 - Admin FAQ Management (Priority: P2)

**Goal**: Admins can CRUD FAQs.

**Independent Test**: Login as admin, create/edit/delete items, verify persistence.

### Implementation for User Story 2

- [ ] T014 [US2] Add Zod schemas (`createFaqSchema`, `updateFaqSchema`) in `packages/api/src/modules/faq/faq.schema.ts`
- [ ] T015 [US2] Add `create`, `update`, `delete`, `findAllAdmin` methods to `FaqService` & `FaqRepository`
- [ ] T016 [US2] Add Admin endpoints (`GET`, `POST`, `PATCH`, `DELETE`) to `FaqController` with AuthGuard
- [ ] T017 [P] [US2] Create API hooks (`useFaqs`, `useCreateFaq`, etc.) in `packages/admin/src/features/faq/faq.queries.ts`
- [ ] T018 [P] [US2] Create `FaqForm` component in `packages/admin/src/features/faq/components/FaqForm.tsx`
- [ ] T019 [US2] Create Admin FAQ List Page in `packages/admin/src/features/faq/routes/FaqRoute.tsx`

**Checkpoint**: Admin CRUD functional.

---

## Phase 5: User Story 3 - Ordering and Visibility (Priority: P3)

**Goal**: Admins can reorder FAQs and toggle visibility.

**Independent Test**: Drag items, refresh, check order. Toggle publish, check public site.

### Implementation for User Story 3

- [ ] T020 [US3] Add `reorderFaqs` transaction logic to `FaqService`
- [ ] T021 [US3] Add `PUT /reorder` endpoint to `FaqController`
- [ ] T022 [US3] Implement Drag-and-Drop in Admin List using `@dnd-kit` in `packages/admin/src/features/faq/components/FaqList.tsx`
- [ ] T023 [US3] Add "Publish/Unpublish" toggle switch in Admin List item

**Checkpoint**: All stories complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T024 [P] Add basic seed data for FAQs in `packages/database/prisma/seed.ts`
- [ ] T025 Manual E2E Verification (Create -> Publish -> Check Public -> Reorder -> Check Public)
- [ ] T026 Documentation update (if needed)

---

## Dependencies & Execution Order

1. **Setup & Foundation (Phase 1 & 2)**: Blocks everything.
2. **User Story 1 (Public)**: Can start after Foundation.
3. **User Story 2 (Admin)**: Can start after Foundation (Independent of US1).
4. **User Story 3 (Ordering)**: Depends on US2 (Admin List must exist to reorder it).

### Parallel Opportunities
- Frontend (US1/US2) and Backend (US1/US2) can run in parallel once Foundation is set.
- US1 (Public) and US2 (Admin) are largely independent and can be parallelized.

