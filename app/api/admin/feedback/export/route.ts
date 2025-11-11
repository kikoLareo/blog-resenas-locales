import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient } from '@/lib/admin-sanity';
import { qrFeedbackListQuery } from '@/sanity/lib/queries';

interface Feedback {
  _id: string;
  _createdAt: string;
  venue: {
    title: string;
    city: { title: string };
  };
  qrCode: string;
  name: string;
  email?: string;
  phone?: string;
  visitDate: string;
  visitTime?: string;
  partySize: number;
  occasion?: string;
  specialRequests?: string;
  rating?: string; // Tipo de visitante
  feedback?: string;
  submittedAt: string;
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener feedback
    const feedbackList = await adminSanityClient.fetch<Feedback[]>(qrFeedbackListQuery);

    // Generar CSV
    const headers = [
      'ID',
      'Fecha Recepción',
      'Local',
      'Ciudad',
      'Código QR',
      'Nombre',
      'Email',
      'Teléfono',
      'Fecha Visita',
      'Hora Visita',
      'Personas',
      'Ocasión',
      'Solicitudes Especiales',
      'Tipo de Cliente',
      'Comentarios',
      'Estado'
    ];

    const csvRows = [
      headers.join(','),
      ...feedbackList.map(item => [
        item._id,
        new Date(item.submittedAt).toLocaleString(),
        `"${item.venue.title}"`,
        `"${item.venue.city.title}"`,
        item.qrCode,
        `"${item.name}"`,
        item.email || '',
        item.phone || '',
        new Date(item.visitDate).toLocaleDateString(),
        item.visitTime || '',
        item.partySize,
        item.occasion ? `"${item.occasion}"` : '',
        item.specialRequests ? `"${item.specialRequests.replace(/"/g, '""')}"` : '',
        item.rating || '',
        item.feedback ? `"${item.feedback.replace(/"/g, '""')}"` : '',
        item.status
      ].join(','))
    ];

    const csv = csvRows.join('\n');

    // Retornar CSV
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="feedback-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting feedback:', error);
    return NextResponse.json(
      { error: 'Error al exportar feedback' },
      { status: 500 }
    );
  }
}
