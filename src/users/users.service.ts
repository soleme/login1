import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export const userSafeSelect = {
  id: true,
  loginId: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type SafeUser = Prisma.UserGetPayload<{ select: typeof userSafeSelect }>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByLoginId(loginId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { loginId },
    });
  }

  findSafeById(id: string): Promise<SafeUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userSafeSelect,
    });
  }

  findAllSafe(): Promise<SafeUser[]> {
    return this.prisma.user.findMany({
      select: userSafeSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  createUser(data: { loginId: string; passwordHash: string; name: string }): Promise<SafeUser> {
    return this.prisma.user.create({
      data,
      select: userSafeSelect,
    });
  }

  deleteById(id: string): Promise<SafeUser> {
    return this.prisma.user.delete({
      where: { id },
      select: userSafeSelect,
    });
  }
}
