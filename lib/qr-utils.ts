import QRCode from 'qrcode';

export interface QRCodeData {
  id: string;
  venueId: string;
  venueSlug: string;
  citySlug: string;
  code: string;
  expiresAt?: string;
  maxUses?: number;
}

export interface QRCodeUsage {
  id: string;
  code: string;
  venueId: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

/**
 * Genera un código único para el QR
 */
export function generateUniqueCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`.toUpperCase();
}

/**
 * Genera un código QR como imagen base64
 */
export async function generateQRCode(data: QRCodeData): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/qr/${data.code}`;
  
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('No se pudo generar el código QR');
  }
}

/**
 * Valida si un código QR está activo y puede ser usado
 */
export function isQRCodeValid(qrCode: {
  isActive: boolean;
  expiresAt?: string;
  maxUses?: number;
  currentUses: number;
}): { valid: boolean; reason?: string } {
  // Verificar si está activo
  if (!qrCode.isActive) {
    return { valid: false, reason: 'Código QR inactivo' };
  }

  // Verificar fecha de expiración
  if (qrCode.expiresAt) {
    const expirationDate = new Date(qrCode.expiresAt);
    const now = new Date();
    
    if (now > expirationDate) {
      return { valid: false, reason: 'Código QR expirado' };
    }
  }

  // Verificar límite de usos
  if (qrCode.maxUses && qrCode.currentUses >= qrCode.maxUses) {
    return { valid: false, reason: 'Límite de usos alcanzado' };
  }

  return { valid: true };
}

/**
 * Registra el uso de un código QR
 */
export async function recordQRUsage(code: string, venueId: string, request?: Request): Promise<void> {
  const usage: QRCodeUsage = {
    id: generateUniqueCode(),
    code,
    venueId,
    timestamp: new Date().toISOString(),
    ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || undefined,
    userAgent: request?.headers.get('user-agent') || undefined,
  };

  // Aquí se podría guardar en una base de datos o enviar a un servicio de analytics
  console.log('QR Code usage recorded:', usage);
}

/**
 * Genera la URL para acceder a través del QR
 */
export function generateQRAccessURL(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl}/qr/${code}`;
}

/**
 * Genera la URL para descargar el QR como imagen
 */
export function generateQRDownloadURL(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl}/api/qr/download/${code}`;
}

