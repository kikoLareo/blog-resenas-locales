import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET || '';

export async function POST(req: NextRequest) {
  // simple protection: require header with admin api secret
  const provided = req.headers.get('x-admin-secret') || '';
  if (!ADMIN_API_SECRET || provided !== ADMIN_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password required' }, { status: 400 });
    }

    const emailNorm = (email as string).toLowerCase();

    // check existing
    const existing = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS || '10', 10);
    const hash = await bcrypt.hash(password as string, saltRounds);

    const created = await prisma.user.create({
      data: {
        email: emailNorm,
        passwordHash: hash,
        role: role || 'MEMBER',
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ user: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
