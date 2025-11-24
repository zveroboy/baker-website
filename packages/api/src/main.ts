import 'reflect-metadata';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { InversifyHonoHttpAdapter } from '@inversifyjs/http-hono';
import { container } from './lib/container';
import { auth } from './lib/auth';

// Import controllers to register them with Inversify
import './http/controllers/health.controller';
import './http/controllers/auth.controller';
import './http/controllers/faq.controller';

const port = Number(process.env.PORT) || 3000;

const appPromise = (async () => {
  const adapter = new InversifyHonoHttpAdapter(container);
  const app = await adapter.build();

  app.use(
    '*',
    cors({
      origin: ['http://localhost:4200', 'http://localhost:4321'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true,
    }),
  );

  app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

  return app;
})();

export const appReady = appPromise;

console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: async (request: Request, env?: unknown, ctx?: unknown) => {
    const app = await appPromise;
    return app.fetch(request, env as any, ctx as any);
  },
};
