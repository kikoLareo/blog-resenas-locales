import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET || '';

/**
 * GET /api/admin/users/[id]
 * Obtiene un usuario específico (requiere x-admin-secret)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const provided = req.headers.get('x-admin-secret') || '';
  if (!ADMIN_API_SECRET || provided !== ADMIN_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

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
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching user:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/users/[id]
 * Actualiza un usuario (rol, nombre, etc.) (requiere x-admin-secret)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const provided = req.headers.get('x-admin-secret') || '';
  if (!ADMIN_API_SECRET || provided !== ADMIN_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { role, name, username, password } = body;

    // Verificar que el usuario existe
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Preparar datos de actualización
    const updateData: any = {};
    
    if (role !== undefined) {
      // Validar rol válido
      const validRoles = ['GUEST', 'MEMBER', 'EDITOR', 'ADMIN'];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
      }
      
      // Si se intenta cambiar de ADMIN a otro rol, verificar que no sea el último admin
      if (existing.role === 'ADMIN' && role !== 'ADMIN') {
        const adminCount = await prisma.user.count({
          where: { role: 'ADMIN' }
        });
        if (adminCount <= 1) {
          return NextResponse.json({ 
            error: 'No se puede cambiar el rol del último administrador' 
          }, { status: 403 });
        }
      }
      
      updateData.role = role;
    }
    
    if (name !== undefined) {
      updateData.name = name ? name.trim() : null;
    }
    
    if (username !== undefined) {
      updateData.username = username ? username.trim() : null;
    }

    // Si se proporciona una nueva contraseña
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ 
          error: 'La contraseña debe tener al menos 8 caracteres' 
        }, { status: 400 });
      }
      
      const bcrypt = require('bcrypt');
      const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS || '10', 10);
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);
    }

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
      return NextResponse.json({ error: 'El nombre de usuario ya está en uso' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Elimina un usuario (requiere x-admin-secret)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const provided = req.headers.get('x-admin-secret') || '';
  if (!ADMIN_API_SECRET || provided !== ADMIN_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

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
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Prevenir eliminar el último ADMIN
    if (existing.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });

      if (adminCount <= 1) {
        return NextResponse.json({ 
          error: 'No se puede eliminar al último administrador del sistema' 
        }, { status: 403 });
      }
    }

    // Eliminar usuario (cascade eliminará sessions, accounts, etc.)
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Usuario eliminado exitosamente',
      deletedUser: {
        id: existing.id,
        email: existing.email
      }
    }, { status: 200 });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

