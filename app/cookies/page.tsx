import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre el uso de cookies en ' + SITE_CONFIG.name,
  openGraph: {
    title: 'Política de Cookies | ' + SITE_CONFIG.name,
    description: 'Información sobre el uso de cookies.',
    type: 'website',
    url: `${SITE_CONFIG.url}/cookies`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/cookies`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CookiesPage() {
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
            <li className="text-gray-900 font-medium">Política de Cookies</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Política de <span className="text-primary-600">Cookies</span>
            </h1>
            <p className="text-lg text-gray-600">
              Información sobre cómo utilizamos las cookies en nuestro sitio web.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <h2>¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Nos ayudan a recordar tus preferencias y a mejorar tu experiencia de navegación.
              </p>

              <h2>Tipos de cookies que utilizamos</h2>
              
              <h3>🔒 Cookies Necesarias</h3>
              <p>
                Estas cookies son esenciales para el funcionamiento básico del sitio web. No se pueden desactivar y no almacenan información personal identificable.
              </p>
              <ul>
                <li><strong>Sesión:</strong> Para mantener tu sesión activa</li>
                <li><strong>Preferencias:</strong> Para recordar configuraciones básicas</li>
                <li><strong>Seguridad:</strong> Para proteger contra ataques</li>
              </ul>

              <h3>📊 Cookies de Análisis</h3>
              <p>
                Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, permitiéndonos mejorarlo continuamente.
              </p>
              <ul>
                <li><strong>Google Analytics:</strong> Para estadísticas de uso anónimas</li>
                <li><strong>Métricas de rendimiento:</strong> Para optimizar la velocidad del sitio</li>
              </ul>

              <h3>🎯 Cookies Publicitarias</h3>
              <p>
                Utilizadas para mostrar anuncios relevantes y medir su efectividad. Solo se activan con tu consentimiento.
              </p>
              <ul>
                <li><strong>Google AdSense:</strong> Para mostrar anuncios contextuales</li>
                <li><strong>Remarketing:</strong> Para personalizar anuncios basados en tu navegación</li>
              </ul>

              <h3>⚙️ Cookies Funcionales</h3>
              <p>
                Mejoran la funcionalidad del sitio web proporcionando características personalizadas.
              </p>
              <ul>
                <li><strong>Preferencias de usuario:</strong> Para recordar tus configuraciones</li>
                <li><strong>Idioma:</strong> Para mostrar el contenido en tu idioma preferido</li>
              </ul>

              <h2>Gestión de cookies</h2>
              <p>
                Puedes gestionar tus preferencias de cookies de las siguientes maneras:
              </p>
              <ul>
                <li><strong>Banner de consentimiento:</strong> Aparece en tu primera visita</li>
                <li><strong>Configuración del navegador:</strong> Puedes bloquear o eliminar cookies</li>
                <li><strong>Herramientas de terceros:</strong> Algunos servicios ofrecen opciones de exclusión</li>
              </ul>

              <h2>Cookies de terceros</h2>
              <p>
                Algunos de nuestros socios pueden establecer cookies en tu dispositivo:
              </p>
              <ul>
                <li><strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">Política de privacidad</a></li>
                <li><strong>Google AdSense:</strong> <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">Política de anuncios</a></li>
              </ul>

              <h2>Duración de las cookies</h2>
              <p>
                Las cookies pueden ser temporales (se eliminan al cerrar el navegador) o persistentes (permanecen hasta su fecha de expiración o hasta que las elimines manualmente).
              </p>

              <h2>Actualizaciones</h2>
              <p>
                Esta política de cookies puede actualizarse ocasionalmente para reflejar cambios en nuestras prácticas o por razones legales.
              </p>

              <h2>Contacto</h2>
              <p>
                Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos a través de nuestro <Link href="/contacto" className="text-primary-600 hover:text-primary-700">formulario de contacto</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}