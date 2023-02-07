/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const firstProjectId = 1;
  await prisma.project.upsert({
    where: {
      id: firstProjectId,
    },
    create: {
      name: 'McDonalds. v Middelfart',
    },
    update: {},
  });

  const resourcesKim = { name: 'Kim', id: 1 };
  const resourcesSven = { name: 'Sven', id: 2 };
  const resourcesMads = { name: 'Mads', id: 3 };
  const resourcesJoergen = { name: 'Jørgen', id: 4 };

  await prisma.resource.upsert({
    where: {
      id: resourcesKim.id,
    },
    create: {
      name: resourcesKim.name,
    },
    update: {},
  });

  await prisma.resource.upsert({
    where: {
      id: resourcesMads.id,
    },
    create: {
      name: resourcesMads.name,
    },
    update: {},
  });

  await prisma.resource.upsert({
    where: {
      id: resourcesJoergen.id,
    },
    create: {
      name: resourcesJoergen.name,
    },
    update: {},
  });

  await prisma.resource.upsert({
    where: {
      id: resourcesSven.id,
    },
    create: {
      name: resourcesSven.name,
    },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
