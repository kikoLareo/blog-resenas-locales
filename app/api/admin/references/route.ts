import { NextRequest, NextResponse } from 'next/server';
import { getReferencesForSelect } from '@/lib/featured-admin';

// GET - Obtener referencias para selects (reseñas, locales, categorías, etc.)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'review' | 'venue' | 'category' | 'collection' | 'guide';

    if (!type || !['review', 'venue', 'category', 'collection', 'guide'].includes(type)) {
      return NextResponse.json(
        { error: 'Valid type parameter is required' },
        { status: 400 }
      );
    }

    const references = await getReferencesForSelect(type);
    return NextResponse.json(references);
  } catch (error) {
    console.error('Error in GET /api/admin/references:', error);
    return NextResponse.json(
      { error: 'Error fetching references' },
      { status: 500 }
    );
  }
}
