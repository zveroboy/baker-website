# Quickstart: FAQ Management Development

## Prerequisites
- Database running (`docker-compose up db -d`)
- Migrations applied (`npm run db:migrate`)

## 1. Apply Schema Changes
```bash
# In packages/database
npx prisma migrate dev --name add_faq_model
```

## 2. API Development
1. Create `packages/api/src/modules/faq` structure.
2. Implement `FaqRepository` (Prisma wrapper).
3. Implement `FaqService` (Business logic).
4. Implement `FaqController` (Hono routes).
5. Bind in `packages/api/src/lib/container.ts`.
6. Register controller in `packages/api/src/main.ts`.

## 3. Admin UI Development
1. Create `packages/admin/src/features/faq` folder.
2. Create API client hooks using `ky` and `TanStack Query` (`useFaqs`, `useCreateFaq`, etc.).
3. Create `FaqList` component with `@dnd-kit` for reordering.
4. Create `FaqForm` dialog/page.
5. Add `/faqs` route to `packages/admin/src/routeTree.gen.ts` (via file-based routing).

## 4. Public UI Development
1. Create `packages/public/src/app/faq/page.tsx`.
2. Fetch FAQs from `http://localhost:3000/api/faqs` (SSR).
3. Render using `Accordion` component from `@baker/ui-shared` (or local Shadcn component).

## Testing
- **Unit**: `vitest` for Service/Repository logic.
- **Manual**:
  1. Go to Admin -> Create FAQ.
  2. Check Public -> Should NOT see it (default unpublished).
  3. Admin -> Publish.
  4. Check Public -> Should see it.
  5. Admin -> Create another -> Reorder.
  6. Check Public -> Order matches.

