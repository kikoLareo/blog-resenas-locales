import { NextRequest, NextResponse } from 'next/server';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      venueId,
      qrCode,
      name,
      email,
      phone,
      visitDate,
      visitTime,
      partySize,
      occasion,
      specialRequests,
      rating,
      feedback,
      submittedAt,
    } = body;

    // Validar datos requeridos
    if (!venueId || !qrCode || !name || !visitDate || !partySize) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Crear el documento de feedback en Sanity
    const feedbackData = {
      _type: 'qrFeedback',
      venue: {
        _type: 'reference',
        _ref: venueId
      },
      qrCode,
      name,
      email: email || undefined,
      phone: phone || undefined,
      visitDate,
      visitTime: visitTime || undefined,
      partySize: parseInt(partySize),
      occasion: occasion || undefined,
      specialRequests: specialRequests || undefined,
      rating: rating || undefined,
      feedback: feedback || undefined,
      submittedAt,
      status: 'pending', // pending, processed, archived
    };

    const result = await adminSanityWriteClient.create(feedbackData);

    // Actualizar el contador de usos del código QR
    const qrCodeDoc = await adminSanityClient.fetch(
      `*[_type == "qrCode" && code == $code][0]`,
      { code: qrCode }
    );

    if (qrCodeDoc) {
      await adminSanityWriteClient
        .patch(qrCodeDoc._id)
        .set({
          currentUses: (qrCodeDoc.currentUses || 0) + 1,
          lastUsedAt: new Date().toISOString(),
        })
        .commit();
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback enviado correctamente',
      id: result._id,
    });

  } catch (error) {
    console.error('Error processing QR feedback:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

