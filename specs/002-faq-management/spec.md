# Feature Specification: FAQ Management System

**Feature Branch**: `002-faq-management`
**Created**: 2025-11-24
**Status**: Draft
**Input**: User description: "@specs_/init/PLAN.md @specs_/init/PRD.md let's implement "### Sprint 3: FAQ (3-4 days)""

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public FAQ Access (Priority: P1)

Customers need to find answers to common questions (allergens, delivery, etc.) without contacting the bakery directly, reducing support workload.

**Why this priority**: This is the customer-facing value. Without this, the feature has no purpose.

**Independent Test**: Can be fully tested by seeding database with FAQs and verifying they appear on the public page in the correct order.

**Acceptance Scenarios**:

1. **Given** published FAQs exist, **When** a customer visits the FAQ page, **Then** they see a list of questions.
2. **Given** a list of questions, **When** a customer clicks a question, **Then** the answer expands (accordion style).
3. **Given** unpublished FAQs exist, **When** a customer visits the FAQ page, **Then** unpublished items are NOT visible.

---

### User Story 2 - Admin FAQ Management (Priority: P2)

Store administrators need to create, update, and delete FAQ content to keep information accurate as business rules change.

**Why this priority**: Essential for maintaining the content displayed in P1.

**Independent Test**: Can be tested by logging in as admin and performing CRUD operations, verifying the database state updates.

**Acceptance Scenarios**:

1. **Given** an admin is logged in, **When** they create a new FAQ with question and answer, **Then** it is saved to the system.
2. **Given** an existing FAQ, **When** the admin updates the text, **Then** the changes are saved.
3. **Given** an FAQ is no longer relevant, **When** the admin deletes it, **Then** it is removed from the system.

---

### User Story 3 - Ordering and Visibility (Priority: P3)

Admins need to control the order of questions (putting most important first) and hide drafts (visibility toggle) to manage the user experience effectively.

**Why this priority**: Enhances usability and content workflow, but core functionality works without it (default sorting/always visible).

**Independent Test**: Test reordering via UI and verifying the 'order' field updates. Test visibility toggle and verify public view respects it.

**Acceptance Scenarios**:

1. **Given** a list of FAQs, **When** the admin drags an item to a new position, **Then** the display order is updated and persisted.
2. **Given** an FAQ item, **When** the admin toggles "Published" to off, **Then** it becomes invisible on the public site but remains in the admin list.

### Edge Cases

- What happens if an admin submits an empty question or answer? (Validation should prevent this).
- What happens to the order index if an item is deleted? (System should handle gaps or re-indexing seamlessly).
- What happens if two admins reorder items simultaneously? (Last write wins is acceptable for this scale).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow Admins to create new FAQ items with "Question", "Answer", and "Published" status.
- **FR-002**: System MUST allow Admins to edit existing FAQ items.
- **FR-003**: System MUST allow Admins to delete FAQ items.
- **FR-004**: System MUST allow Admins to change the display order of FAQs (e.g., via drag-and-drop interface).
- **FR-005**: Public FAQ page MUST display only items with "Published" status set to true.
- **FR-006**: Public FAQ page MUST display items sorted by their assigned order index.
- **FR-007**: System MUST validate that "Question" and "Answer" fields are not empty.
- **FR-008**: System MUST strip unsafe HTML from "Question" and "Answer" inputs to prevent XSS, while allowing safe formatting if needed (basic text).

### Key Entities *(include if feature involves data)*

- **FAQ Item**: Represents a single Question/Answer pair.
  - Attributes: ID, Question (Text), Answer (Text), Order (Integer), IsPublished (Boolean).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can create and publish a new FAQ item in under 1 minute.
- **SC-002**: Public FAQ page loads and displays 50+ items in under 1 second.
- **SC-003**: Reordering an item in the Admin panel is reflected on the Public page immediately (on next refresh/navigation).
