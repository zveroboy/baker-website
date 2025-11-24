import { describe, it, expect } from 'vitest';
import { appReady } from '../src/main';
import { auth } from '../src/lib/auth';

describe('AuthController', () => {
  it('should allow sign-in endpoint to respond (status not 404)', async () => {
    const app = await appReady;
    const req = new Request('http://localhost/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    const res = await app.fetch(req);
    expect(res.status).not.toBe(404);
  });
});

