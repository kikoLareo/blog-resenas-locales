import { NextRequest, NextResponse } from 'next/server';
import { updateFeaturedItemOrder } from '@/lib/featured-admin';

// PUT - Actualizar orden de múltiples items
export async function PUT(request: NextRequest) {
  try {
    const { items } = await request.json();
    
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 }
      );
    }

    // Validar que cada item tenga _id y order
    const isValid = items.every(item => 
      item._id && typeof item.order === 'number'
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Each item must have _id and order' },
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
    return NextResponse.json(
      { error: 'Error updating items order' },
      { status: 500 }
    );
  }
}

