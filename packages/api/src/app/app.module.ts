import { Module, Controller, Get } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Controller()
class AppController {
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

