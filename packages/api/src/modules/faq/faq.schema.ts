import { z } from 'zod';

export const createFaqSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(255),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
  isPublished: z.boolean().optional().default(false),
});

export const updateFaqSchema = createFaqSchema.partial();

export const reorderFaqSchema = z.array(
  z.object({
    id: z.string().uuid(),
    order: z.number().int(),
  })
);


