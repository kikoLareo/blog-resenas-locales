import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * API Route para forzar revalidación manual de rutas
 * 
 * Usage:
 * POST /api/revalidate-manual
 * Body: { paths: ["/barcelona", "/madrid"] }
 * 
 * O visitar desde el navegador:
 * GET /api/revalidate-manual?path=/barcelona
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paths = body.paths || [];

    if (paths.length === 0) {
      return NextResponse.json(
        { error: 'No paths provided' },
        { status: 400 }
      );
    }

    const results = [];
    for (const path of paths) {
      try {
        revalidatePath(path);
        results.push({ path, status: 'revalidated' });
      } catch (error) {
        results.push({ 
          path, 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return NextResponse.json({
      message: 'Revalidation complete',
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Missing path parameter. Usage: /api/revalidate-manual?path=/barcelona' },
        { status: 400 }
      );
    }

    revalidatePath(path);

    return NextResponse.json({
      message: 'Path revalidated successfully',
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Revalidation failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
