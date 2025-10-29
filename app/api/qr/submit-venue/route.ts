import { NextRequest, NextResponse } from 'next/server';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';
import { qrCodeOnboardingQuery } from '@/sanity/lib/queries';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract QR code
    const qrCode = formData.get('qrCode') as string;
    
    if (!qrCode) {
      return NextResponse.json(
        { error: 'Código QR es requerido' },
        { status: 400 }
      );
    }

    // Validate QR code
    const qrCodeDoc = await adminSanityClient.fetch(qrCodeOnboardingQuery, { code: qrCode });
    
    if (!qrCodeDoc) {
      return NextResponse.json(
        { error: 'Código QR no encontrado' },
        { status: 404 }
      );
    }

    if (!qrCodeDoc.isActive) {
      return NextResponse.json(
        { error: 'Código QR inactivo' },
        { status: 400 }
      );
    }

    if (!qrCodeDoc.isOnboarding) {
      return NextResponse.json(
        { error: 'Este código QR no es para registro de locales' },
        { status: 400 }
      );
    }

    if (qrCodeDoc.isUsed) {
      return NextResponse.json(
        { error: 'Este código QR ya ha sido utilizado' },
        { status: 400 }
      );
    }

    // Check expiration
    if (qrCodeDoc.expiresAt && new Date(qrCodeDoc.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Este código QR ha expirado' },
        { status: 400 }
      );
    }

    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const address = formData.get('address') as string;
    const postalCode = formData.get('postalCode') as string;
    const cityId = formData.get('cityId') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const website = formData.get('website') as string;
    const priceRange = formData.get('priceRange') as string;
    const submittedBy = formData.get('submittedBy') as string;
    
    // Parse categories (JSON array)
    const categoriesJson = formData.get('categories') as string;
    const categories = categoriesJson ? JSON.parse(categoriesJson) : [];
    
    // Parse opening hours (JSON object)
    const openingHoursJson = formData.get('openingHours') as string;
    const openingHours = openingHoursJson ? JSON.parse(openingHoursJson) : null;
    
    // Parse geolocation (JSON object)
    const geoJson = formData.get('geo') as string;
    const geo = geoJson ? JSON.parse(geoJson) : null;

    // Validate required fields
    if (!title || !description || !address || !cityId || !phone || !email || !submittedBy) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (categories.length === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos una categoría' },
        { status: 400 }
      );
    }

    // Upload images to Sanity
    const images = [];
    const imageFiles = formData.getAll('images');
    
    for (const file of imageFiles) {
      if (file instanceof File) {
        try {
          // Convert File to Buffer
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          // Upload to Sanity
          const asset = await adminSanityWriteClient.assets.upload('image', buffer, {
            filename: file.name,
            contentType: file.type,
          });
          
          images.push({
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
            alt: `${title} - Imagen`,
          });
        } catch (uploadError) {
          // Continue with other images if one fails
          // Log error silently
        }
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'Debe subir al menos una imagen' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create venue submission document
    const submissionData = {
      _type: 'venueSubmission',
      status: 'pending',
      qrCode: {
        _type: 'reference',
        _ref: qrCodeDoc._id,
      },
      submittedAt: new Date().toISOString(),
      submittedBy,
      
      // Venue data
      title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      description,
      address,
      postalCode: postalCode || undefined,
      city: {
        _type: 'reference',
        _ref: cityId,
      },
      categories: categories.map((catId: string) => ({
        _type: 'reference',
        _ref: catId,
      })),
      
      // Contact
      phone,
      email,
      website: website || undefined,
      
      // Additional
      priceRange,
      openingHours: openingHours || undefined,
      geo: geo || undefined,
      images,
    };

    // Create submission
    const submission = await adminSanityWriteClient.create(submissionData);

    // Mark QR code as used
    await adminSanityWriteClient
      .patch(qrCodeDoc._id)
      .set({
        isUsed: true,
        usedAt: new Date().toISOString(),
        submission: {
          _type: 'reference',
          _ref: submission._id,
        },
      })
      .commit();

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada correctamente',
      submissionId: submission._id,
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
