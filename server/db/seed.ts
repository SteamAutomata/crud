#!/usr/bin/env node
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  prisma.$transaction([
    prisma.$executeRaw`INSERT INTO \`User\` 
        (email, password, name, signature) 
        VALUES 
        ('alice@example.com', 'alice', 'alice', 'my signature'),
        ('paul@example.com', 'paul', 'paul', 'paul signature');
    `,
    prisma.$executeRaw`INSERT INTO \`User\` 
        (email, password, name, signature, role) 
        VALUES 
        ('ethan@example.com', 'ethan', 'ethan', 'ethan signature', 'ADMIN');
    `,
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
