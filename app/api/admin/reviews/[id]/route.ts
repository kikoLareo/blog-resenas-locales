import { NextRequest, NextResponse } from 'next/server';
import { adminSanityWriteClient } from '@/lib/admin-sanity';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

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
      // Convertir string simple a Portable Text si es necesario
      body: typeof body.content === 'string' 
        ? [
            {
              _type: 'block',
              style: 'normal',
              markDefs: [],
              children: [
                {
                  _type: 'span',
                  marks: [],
                  text: body.content
                }
              ]
            }
          ]
        : body.content,
      tldr: body.tldr || '',
      published: body.published || false,
      venue: {
        _type: 'reference',
        _ref: body.venueId
      },
      ratings: {
        food: Number(body.ratings.food),
        service: Number(body.ratings.service),
        ambience: Number(body.ratings.ambience), // Frontend sends ambience, Schema expects ambience
        value: Number(body.ratings.value),
        // Calcular overall si no viene
        overall: (
          Number(body.ratings.food) + 
          Number(body.ratings.service) + 
          Number(body.ratings.ambience) + 
          Number(body.ratings.value)
        ) / 4
      },
      tags: body.tags || [],
      author: body.author || 'Foodie Galicia',
      visitDate: body.visitDate || new Date().toISOString().split('T')[0],
      _updatedAt: new Date().toISOString()
    };

    // Si hay imágenes, procesarlas
    if (body.images && Array.isArray(body.images)) {
       updateDoc.gallery = body.images.map((img: any) => ({
         _type: 'image',
         _key: img._id || Math.random().toString(36).substring(7),
         asset: {
           _type: 'reference',
           _ref: img._id // Asumimos que _id es el ID del asset de Sanity
         },
         alt: img.alt || '',
         caption: img.caption || ''
       }));
    }

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
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Eliminar de Sanity
    const result = await adminSanityWriteClient.delete(id);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}