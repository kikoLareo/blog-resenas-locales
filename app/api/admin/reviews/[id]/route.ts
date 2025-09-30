import { NextRequest, NextResponse } from 'next/server';
import { adminSanityWriteClient } from '@/lib/admin-sanity';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Validar datos requeridos
    if (!body.title || !body.content || !body.venueId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Preparar el documento para actualizar
    const updateDoc: any = {
      title: body.title,
      slug: {
        current: body.slug
      },
      content: body.content,
      excerpt: body.excerpt || '',
      published: body.published || false,
      venue: {
        _type: 'reference',
        _ref: body.venueId
      },
      ratings: {
        overall: Number(body.ratings.overall),
        food: Number(body.ratings.food),
        service: Number(body.ratings.service),
        atmosphere: Number(body.ratings.atmosphere),
        value: Number(body.ratings.value)
      },
      tags: body.tags || [],
      seoTitle: body.seoTitle || '',
      metaDescription: body.metaDescription || '',
      _updatedAt: new Date().toISOString()
    };

    // Si se está publicando, agregar publishedAt
    if (body.published && !body.publishedAt) {
      updateDoc.publishedAt = new Date().toISOString();
    }

    // Actualizar en Sanity
    const result = await adminSanityWriteClient
      .patch(id)
      .set(updateDoc)
      .commit();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Eliminar de Sanity
    const result = await adminSanityWriteClient.delete(id);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}