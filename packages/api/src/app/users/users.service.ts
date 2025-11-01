import { Injectable } from '@nestjs/common';
import { prisma } from '@baker/database';

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}
