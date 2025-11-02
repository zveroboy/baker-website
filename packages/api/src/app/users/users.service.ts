import { prisma } from "@baker/database";
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}
