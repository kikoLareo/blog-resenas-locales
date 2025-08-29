import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllFeaturedItems, 
  createFeaturedItem, 
  updateFeaturedItemOrder,
  getFeaturedItemsStats 
} from '@/lib/featured-admin';

// GET - Obtener todos los featured items o estadísticas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      const stats = await getFeaturedItemsStats();
      return NextResponse.json(stats);
    }

    const items = await getAllFeaturedItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error in GET /api/admin/featured-items:', error);
    return NextResponse.json(
      { error: 'Error fetching featured items' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo featured item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await createFeaturedItem(body);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Error creating featured item' },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/featured-items:', error);
    return NextResponse.json(
      { error: 'Error creating featured item' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar orden de múltiples items
export async function PATCH(request: NextRequest) {
  try {
    const { items } = await request.json();
    
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 }
      );
    }

    const success = await updateFeaturedItemOrder(items);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Error updating items order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PATCH /api/admin/featured-items:', error);
    return NextResponse.json(
      { error: 'Error updating items order' },
      { status: 500 }
    );
  }
}
