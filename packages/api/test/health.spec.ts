import { describe, it, expect } from 'vitest';
import { appReady } from '../src/main';

describe('HealthController', () => {
  it('should return 200 OK', async () => {
    const app = await appReady;
    const res = await app.fetch(new Request('http://localhost/health'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
    });
  });
});

