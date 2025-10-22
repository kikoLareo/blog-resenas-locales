import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET || '';

/**
 * GET /api/admin/users
 * Lista todos los usuarios (requiere x-admin-secret)
 */
export async function GET(req: NextRequest) {
  // simple protection: require header with admin api secret
  const provided = req.headers.get('x-admin-secret') || '';
  if (!ADMIN_API_SECRET || provided !== ADMIN_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        image: true,
        _count: {
          select: {
            accounts: true,
            sessions: true,
            paywallSubscriptions: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Agrupar por rol
    const stats = {
      total: users.length,
      byRole: {
        ADMIN: users.filter(u => u.role === 'ADMIN').length,
        EDITOR: users.filter(u => u.role === 'EDITOR').length,
        MEMBER: users.filter(u => u.role === 'MEMBER').length,
        GUEST: users.filter(u => u.role === 'GUEST').length,
      },
      verified: users.filter(u => u.emailVerified).length,
      withImage: users.filter(u => u.image).length,
    };

    return NextResponse.json({ users, stats }, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching users:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Crea un nuevo usuario (requiere x-admin-secret)
 */
export async function POST(req: NextRequest) {
  // simple protection: require header with admin api secret
  const provided = req.headers.get('x-admin-secret') || '';
  if (!ADMIN_API_SECRET || provided !== ADMIN_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, password, role, name } = body;

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
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ user: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
