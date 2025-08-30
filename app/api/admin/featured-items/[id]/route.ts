import { NextRequest, NextResponse } from 'next/server';
import { 
  getFeaturedItemById, 
  updateFeaturedItem, 
  deleteFeaturedItem,
  toggleFeaturedItemStatus 
} from '@/lib/featured-admin';

// GET - Obtener featured item por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await getFeaturedItemById(id);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Featured item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error in GET /api/admin/featured-items/[id]:', error);
    return NextResponse.json(
      { error: 'Error fetching featured item' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar featured item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData = { ...body, _id: id };
    
    const result = await updateFeaturedItem(updateData);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Error updating featured item' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in PUT /api/admin/featured-items/[id]:', error);
    return NextResponse.json(
      { error: 'Error updating featured item' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar featured item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteFeaturedItem(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Error deleting featured item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/featured-items/[id]:', error);
    return NextResponse.json(
      { error: 'Error deleting featured item' },
      { status: 500 }
    );
  }
}

// PATCH - Toggle status activo/inactivo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isActive } = await request.json();
    
    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean' },
        { status: 400 }
      );
    }

    const success = await toggleFeaturedItemStatus(id, isActive);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Error updating featured item status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PATCH /api/admin/featured-items/[id]:', error);
    return NextResponse.json(
      { error: 'Error updating featured item status' },
      { status: 500 }
    );
  }
}
