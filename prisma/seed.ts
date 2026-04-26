import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const LOGIN_ID_PATTERN = /^[A-Za-z0-9_]{3,32}$/;

async function main() {
  const loginId = process.env.ADMIN_LOGIN_ID ?? process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Administrator';

  if (!LOGIN_ID_PATTERN.test(loginId)) {
    throw new Error('ADMIN_LOGIN_ID must be 3-32 characters and contain only letters, numbers, or underscore.');
  }

  if (!password || password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be set and at least 8 characters long.');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { loginId },
    update: {
      passwordHash,
      name,
      role: Role.ADMIN,
    },
    create: {
      loginId,
      passwordHash,
      name,
      role: Role.ADMIN,
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
