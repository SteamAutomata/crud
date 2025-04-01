#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('123456', 13)

  prisma.$transaction([
    prisma.$executeRaw`INSERT INTO \`User\` 
        (email, password, name, signature) 
        VALUES 
        ('alice@example.com', '${password}', 'alice', 'my signature'),
        ('paul@example.com', '${password}', 'paul', 'paul signature');
    `,
    prisma.$executeRaw`INSERT INTO \`User\` 
        (email, password, name, signature, role) 
        VALUES 
        ('ethan@example.com', '${password}', 'ethan', 'ethan signature', 'ADMIN');
    `,
  ])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
