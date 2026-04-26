import { Role } from '@prisma/client';

export type RequestUser = {
  id: string;
  loginId: string;
  role: Role;
};
