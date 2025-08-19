import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity.client';
import { qrCodeByCodeQuery } from '@/sanity/lib/queries';
import { isQRCodeValid, recordQRUsage } from '@/lib/qr-utils';
import QRVenueForm from '@/components/QRVenueForm';

interface QRCodePageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function QRCodePage({ params }: QRCodePageProps) {
  const { code } = await params;
  
  // Obtener datos del código QR
  const qrCode = await sanityFetch({ query: qrCodeByCodeQuery, params: { code } });
  
  if (!qrCode) {
    notFound();
  }

  // Validar el código QR
  const validation = qrCode && typeof qrCode === 'object' && 'isActive' in qrCode ? isQRCodeValid(qrCode as any) : { valid: false, reason: 'Código QR no encontrado' };
  
  if (!validation.valid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Código QR no válido
          </h1>
          <p className="text-gray-600 mb-4">
            {validation.reason}
          </p>
          <p className="text-sm text-gray-500">
            Contacta con el administrador del local para obtener un código válido.
          </p>
        </div>
      </div>
    );
  }

  // Registrar el uso del código QR
  if (qrCode && typeof qrCode === 'object' && 'venue' in qrCode && qrCode.venue) {
    await recordQRUsage(code, (qrCode.venue as any)._id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header minimalista */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {qrCode && typeof qrCode === 'object' && 'venue' in qrCode && qrCode.venue ? (qrCode.venue as any).title : 'Local no encontrado'}
              </h1>
              <p className="text-sm text-gray-600">
                {qrCode && typeof qrCode === 'object' && 'venue' in qrCode && qrCode.venue && (qrCode.venue as any).city ? (qrCode.venue as any).city.title : 'Ciudad no encontrada'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Acceso QR</div>
              <div className="text-xs text-gray-400">
                {qrCode && typeof qrCode === 'object' && 'title' in qrCode ? (qrCode as any).title : 'Código QR'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Información del local */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">
              ¡Bienvenido a {qrCode && typeof qrCode === 'object' && 'venue' in qrCode && qrCode.venue ? (qrCode.venue as any).title : 'este local'}!
            </h2>
            <p className="text-blue-100">
              Completa la información de tu visita para mejorar tu experiencia
            </p>
          </div>

          {/* Formulario */}
          <div className="p-6">
            <QRVenueForm 
              venueId={qrCode && typeof qrCode === 'object' && 'venue' in qrCode && qrCode.venue ? (qrCode.venue as any)._id : ''}
              venueName={qrCode && typeof qrCode === 'object' && 'venue' in qrCode && qrCode.venue ? (qrCode.venue as any).title : 'Local'}
              qrCode={code}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información del código QR
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Código:</span>
              <div className="text-gray-600 font-mono">{code}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Usos:</span>
              <div className="text-gray-600">
                {qrCode && typeof qrCode === 'object' && 'currentUses' in qrCode ? (qrCode as any).currentUses + 1 : 1}
                {qrCode && typeof qrCode === 'object' && 'maxUses' in qrCode && (qrCode as any).maxUses && ` / ${(qrCode as any).maxUses}`}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Estado:</span>
              <div className="text-gray-600">
                {qrCode && typeof qrCode === 'object' && 'isActive' in qrCode && (qrCode as any).isActive ? '✅ Activo' : '❌ Inactivo'}
              </div>
            </div>
          </div>
          
          {qrCode && typeof qrCode === 'object' && 'description' in qrCode && (qrCode as any).description && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Descripción:</span>
              <div className="text-gray-600 mt-1">{(qrCode as any).description}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

