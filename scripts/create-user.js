#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || process.env.NEW_USER_EMAIL;
  const password = process.argv[3] || process.env.NEW_USER_PASSWORD;
  const role = process.argv[4] || process.env.NEW_USER_ROLE || 'MEMBER';

  if (!email || !password) {
    console.log('Uso: node scripts/create-user.js <email> <password> [ROLE]');
    console.log('Ejemplo: node scripts/create-user.js admin@example.com S3cr3t ADMIN');
    process.exit(1);
  }

  const emailNorm = String(email).toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: emailNorm } });
  if (existing) {
    console.error('Usuario ya existe:', emailNorm);
    await prisma.$disconnect();
    process.exit(1);
  }

  const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS || '10', 10);
  const hash = await bcrypt.hash(String(password), saltRounds);

  const created = await prisma.user.create({
    data: {
      email: emailNorm,
      passwordHash: hash,
      role,
    },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  console.log('Usuario creado:', created);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Error:', err);
  try { await prisma.$disconnect(); } catch {};
  process.exit(1);
});
