import { z } from 'zod';
import { Context, Next } from 'hono';
import { validator } from 'hono/validator';

export const validate = (schema: z.ZodSchema, target: 'json' | 'form' | 'query' | 'param' = 'json') => {
  return validator(target, async (value, c) => {
    const result = await schema.safeParseAsync(value);
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
    return result.data;
  });
};

