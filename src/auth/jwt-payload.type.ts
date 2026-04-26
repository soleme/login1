import { Role } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  loginId: string;
  role: Role;
};
