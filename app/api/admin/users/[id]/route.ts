import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET || '';

/**
 * GET /api/admin/users/[id]
 * Obtiene un usuario específico (requiere x-admin-secret)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const provided = req.headers.get('x-admin-secret') || '';
  if (!ADMIN_API_SECRET || provided !== ADMIN_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
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
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching user:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/users/[id]
 * Actualiza un usuario (rol, nombre, etc.) (requiere x-admin-secret)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const provided = req.headers.get('x-admin-secret') || '';
  if (!ADMIN_API_SECRET || provided !== ADMIN_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    const { role, name, username } = body;

    // Verificar que el usuario existe
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Preparar datos de actualización
    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (err: any) {
    console.error('Error updating user:', err);
    
    // Manejo de errores específicos de Prisma
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Elimina un usuario (requiere x-admin-secret)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const provided = req.headers.get('x-admin-secret') || '';
  if (!ADMIN_API_SECRET || provided !== ADMIN_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    // Verificar que el usuario existe
    const existing = await prisma.user.findUnique({ 
      where: { id },
      select: { 
        id: true, 
        email: true, 
        role: true,
        _count: {
          select: {
            sessions: true
          }
        }
      } 
    });

    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevenir eliminar el último ADMIN
    if (existing.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });

      if (adminCount <= 1) {
        return NextResponse.json({ 
          error: 'Cannot delete the last ADMIN user' 
        }, { status: 403 });
      }
    }

    // Eliminar usuario (cascade eliminará sessions, accounts, etc.)
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: existing.id,
        email: existing.email
      }
    }, { status: 200 });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

