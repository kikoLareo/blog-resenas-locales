import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos de ' + SITE_CONFIG.name,
  openGraph: {
    title: 'Política de Privacidad | ' + SITE_CONFIG.name,
    description: 'Política de privacidad y protección de datos.',
    type: 'website',
    url: `${SITE_CONFIG.url}/politica-privacidad`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/politica-privacidad`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-wide py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-primary-600">Inicio</Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">Política de Privacidad</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Política de <span className="text-primary-600">Privacidad</span>
            </h1>
            <p className="text-lg text-gray-600" suppressHydrationWarning>
              Última actualización: {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date())}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <h2>1. Información que recopilamos</h2>
              <p>
                En {SITE_CONFIG.name} recopilamos información de las siguientes maneras:
              </p>
              <ul>
                <li><strong>Información proporcionada voluntariamente:</strong> Como cuando te suscribes a nuestro newsletter o nos contactas.</li>
                <li><strong>Información de navegación:</strong> Datos sobre cómo interactúas con nuestro sitio web.</li>
                <li><strong>Cookies y tecnologías similares:</strong> Para mejorar tu experiencia y personalizar el contenido.</li>
              </ul>

              <h2>2. Cómo utilizamos tu información</h2>
              <p>Utilizamos la información recopilada para:</p>
              <ul>
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Enviar newsletters y comunicaciones (solo si te has suscrito)</li>
                <li>Analizar el uso del sitio web para mejorarlo</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>

              <h2>3. Cookies</h2>
              <p>
                Utilizamos cookies para mejorar tu experiencia en nuestro sitio. Puedes gestionar tus preferencias de cookies a través del banner de consentimiento o en la configuración de tu navegador.
              </p>

              <h2>4. Compartir información</h2>
              <p>
                No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:
              </p>
              <ul>
                <li>Cuando sea necesario para proporcionar el servicio solicitado</li>
                <li>Para cumplir con obligaciones legales</li>
                <li>Con tu consentimiento explícito</li>
              </ul>

              <h2>5. Seguridad</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>

              <h2>6. Tus derechos</h2>
              <p>Bajo el RGPD, tienes derecho a:</p>
              <ul>
                <li>Acceder a tu información personal</li>
                <li>Rectificar información inexacta</li>
                <li>Solicitar la eliminación de tu información</li>
                <li>Limitar el procesamiento de tu información</li>
                <li>Portabilidad de datos</li>
                <li>Oponerte al procesamiento</li>
              </ul>

              <h2>7. Retención de datos</h2>
              <p>
                Conservamos tu información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política o según lo requerido por la ley.
              </p>

              <h2>8. Cambios en esta política</h2>
              <p>
                Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos publicando la nueva política en esta página.
              </p>

              <h2>9. Contacto</h2>
              <p>
                Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tu información personal, puedes contactarnos en:
              </p>
              <ul>
                <li>Email: privacidad@example.com</li>
                <li>A través de nuestro <Link href="/contacto" className="text-primary-600 hover:text-primary-700">formulario de contacto</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}