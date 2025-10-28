import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/admin/migrate
 * Ejecuta la migración de HomepageSection manualmente
 * TEMPORAL - Solo para crear la tabla en producción
 */
export async function POST() {
  try {
    // Ejecutar la migración SQL directamente
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "HomepageSection" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "sectionType" TEXT NOT NULL,
        "enabled" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL,
        "config" JSONB NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "HomepageSection_pkey" PRIMARY KEY ("id")
      );
    `);

    // Crear índice si no existe
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "HomepageSection_enabled_order_idx" 
      ON "HomepageSection"("enabled", "order");
    `);

    return NextResponse.json({
      success: true,
      message: 'Migration executed successfully',
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Migration failed',
        details: error?.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/migrate
 * Verifica si la tabla existe
 */
export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'HomepageSection'
      );
    `);

    return NextResponse.json({
      success: true,
      tableExists: (result as any)[0].exists,
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error?.message 
      },
      { status: 500 }
    );
  }
}
