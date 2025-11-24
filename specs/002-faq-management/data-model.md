# Data Model: FAQ Management System

## Database Schema (Prisma)

```prisma
// packages/database/prisma/schema.prisma

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

## Shared Types (DTOs)

```typescript
// packages/shared-types/src/index.ts

export interface FaqDto {
  id: string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
}

export type CreateFaqDto = Pick<FaqDto, 'question' | 'answer'> & {
  isPublished?: boolean;
};

export type UpdateFaqDto = Partial<CreateFaqDto>;

export interface ReorderFaqItem {
  id: string;
  order: number;
}

export type ReorderFaqDto = ReorderFaqItem[];
```

## API Contracts

### Endpoints

| Method | Path | Auth | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/faqs` | Public | Get published FAQs | - | `FaqDto[]` |
| `GET` | `/api/admin/faqs` | Admin | Get all FAQs | - | `FaqDto[]` |
| `POST` | `/api/admin/faqs` | Admin | Create FAQ | `CreateFaqDto` | `FaqDto` |
| `PATCH` | `/api/admin/faqs/:id` | Admin | Update FAQ | `UpdateFaqDto` | `FaqDto` |
| `PUT` | `/api/admin/faqs/reorder` | Admin | Reorder FAQs | `ReorderFaqDto` | `void` |
| `DELETE` | `/api/admin/faqs/:id` | Admin | Delete FAQ | - | `void` |

### Validation Schemas (Zod)

```typescript
// packages/api/src/modules/faq/faq.schema.ts

import { z } from 'zod';

export const createFaqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters").max(255),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  isPublished: z.boolean().optional().default(false),
});

export const updateFaqSchema = createFaqSchema.partial();

export const reorderFaqSchema = z.array(
  z.object({
    id: z.string().uuid(),
    order: z.number().int(),
  })
);
```

