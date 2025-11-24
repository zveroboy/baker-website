import { Controller, Get } from '@inversifyjs/http-core';

@Controller('/health')
export class HealthController {
  @Get('/')
  public async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
