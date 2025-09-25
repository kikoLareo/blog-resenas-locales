import { NextRequest, NextResponse } from 'next/server';
import { adminSanityClient } from '@/lib/admin-sanity';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande (máximo 5MB)' },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir a Sanity
    const result = await adminSanityClient.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    // Obtener la URL de la imagen
    const imageUrl = `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/${process.env.SANITY_DATASET}/${result._id}.${result.extension}`;

    return NextResponse.json({
      _id: result._id,
      url: imageUrl,
      filename: file.name,
      size: file.size,
      contentType: file.type,
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

