# Research: FAQ Management System

**Status**: Phase 0 - Research & Validation
**Date**: 2025-11-24

## 1. Data Modeling Strategy

### Database Schema (Prisma)
We need a simple `FAQ` model.

**Proposed Schema**:
```prisma
model FAQ {
  id          String   @id @default(uuid())
  question    String
  answer      String
  order       Int      @default(0)
  isPublished Boolean  @default(false) @map("is_published")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("faqs")
}
```

**Indexing**:
- Primary Key: `id`
- Ordering: We might query by `order` ASC. An index on `order` could be useful if the list grows large, but for <100 items, it's negligible.
- Filtering: Index on `isPublished` for public queries? (Likely unnecessary for small datasets).

### Ordering Strategy
**Approach**: "Gap" vs "Resequence".
- *Resequence*: When item moved from 5 to 2, items 2,3,4 shift down.
  - *Pros*: Clean sequence (1,2,3,4).
  - *Cons*: Multiple DB updates per move.
- *Gap/Floating*: Use large gaps (1000, 2000) or floating point.
  - *Recommendation*: **Resequence**. The dataset is tiny (max 50 items). A simple transaction updating 50 rows is nearly instant and keeps the data clean for humans.

## 2. API Architecture (Hono + Inversify)

**Controller**: `FaqController`
- `GET /faqs` (Public) - Returns published only, sorted by order.
- `GET /admin/faqs` (Admin) - Returns all, sorted by order.
- `POST /admin/faqs` - Create.
- `PATCH /admin/faqs/:id` - Update content or toggle publish.
- `PUT /admin/faqs/reorder` - Bulk update orders.
- `DELETE /admin/faqs/:id` - Delete.

**Service**: `FaqService`
- Encapsulates business logic (e.g., "Gap filling" if we choose that, or handling the reorder transaction).

**Repository**: `FaqRepository`
- Wraps Prisma calls.

## 3. Frontend Strategy

### Public (Next.js)
- **Rendering**: Server Component (`page.tsx`) fetches FAQs directly from API (or DB if allowed, but API preferred for consistency).
- **UI**: Shadcn `Accordion` component.
- **SEO**: FAQ Schema Markup (JSON-LD) for better search results.

### Admin (Vite)
- **State Management**: `TanStack Query` for fetching list.
- **Forms**: `TanStack Form` or `react-hook-form` + Zod.
- **Reordering UI**: `@dnd-kit/core` and `@dnd-kit/sortable`. It's robust, accessible, and standard in React ecosystem.
- **Optimistic Updates**: When dragging, UI updates instantly; API call happens in background.

## 4. Security Considerations

- **XSS**: Answers might need basic formatting (bold, links).
  - *Option A*: Plain text only. Safe, easy.
  - *Option B*: Markdown. Requires rendering lib.
  - *Option C*: HTML. Dangerous.
  - *Recommendation*: **Plain Text** for MVP. If formatting needed later, use Markdown.
- **Auth**: Admin endpoints protected by `AuthGuard`.

## 5. Validation Rules (Zod)

```typescript
const createFaqSchema = z.object({
  question: z.string().min(5).max(200),
  answer: z.string().min(10).max(1000),
  isPublished: z.boolean().optional()
});

const reorderFaqSchema = z.array(
  z.object({
    id: z.string().uuid(),
    order: z.number().int()
  })
);
```

