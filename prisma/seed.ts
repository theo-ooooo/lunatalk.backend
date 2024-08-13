import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.categories.createMany({
    data: [
      { name: 'acc', active: 'Y' },
      { name: 'bag', active: 'Y' },
      { name: 'stationery', active: 'Y' },
      { name: 'wallet', active: 'Y' },
      { name: 'military', active: 'Y' },
    ],
    skipDuplicates: true,
  });

  console.log({ categories });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
