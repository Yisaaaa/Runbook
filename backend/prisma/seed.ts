import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Runbook } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { userData, runbooksData } from './data';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  console.log('Seeding database...');
  console.log('Clearing existing rows');
  await prisma.user.deleteMany();
  await prisma.runbook.deleteMany();
  await prisma.session.deleteMany();
  await prisma.executionLog.deleteMany();

  const hashedPass = await bcrypt.hash('hardpass', 10);
  const user = await prisma.user.create({
    data: { ...userData, passwordHash: hashedPass },
  });
  console.log('Created user: ', user);

  const runbooks = await prisma.runbook.createManyAndReturn({
    data: runbooksData,
  });

  console.log('Created runbooks: ', runbooks);
  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.log('Error while seeding data:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
