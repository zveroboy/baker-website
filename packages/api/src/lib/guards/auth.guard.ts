import { Context, Next } from 'hono';
import { auth } from '../auth';

export const authGuard = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Attach session to context if needed
  c.set('user', session.user);
  c.set('session', session.session);

  await next();
};

