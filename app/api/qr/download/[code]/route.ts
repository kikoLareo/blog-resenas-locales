import { NextRequest, NextResponse } from 'next/server';
import { generateQRAccessURL } from '@/lib/qr-utils';
import QRCode from 'qrcode';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const url = generateQRAccessURL(code);

    // Generar el código QR como buffer PNG
    const qrBuffer = await QRCode.toBuffer(url, {
      width: 600,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });

    // Retornar como imagen PNG
    return new NextResponse(qrBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="qr-${code}.png"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Error al generar el código QR' },
      { status: 500 }
    );
  }
}
