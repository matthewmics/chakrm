import { Injectable } from '@nestjs/common';
import type { Prisma, User } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Every lookup filters `deletedAt: null` — a soft-deleted user must not be able
 * to sign in, and must stop being resolvable mid-session too, since JwtStrategy
 * re-reads the record on every request.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id, deletedAt: null } });
  }

  /** Emails are stored lowercased, so callers must normalise before calling. */
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  findByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { googleId, deletedAt: null } });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }
}
