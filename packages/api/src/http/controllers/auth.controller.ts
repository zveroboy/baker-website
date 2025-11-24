import { Controller, Get } from '@inversifyjs/http-core';

@Controller('/api/auth')
export class AuthController {
  @Get('/list')
  public async list() {
    return { status: 'auth-active' };
  }
}
