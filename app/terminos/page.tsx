import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Términos de Uso',
  description: 'Términos y condiciones de uso de ' + SITE_CONFIG.name,
  openGraph: {
    title: 'Términos de Uso | ' + SITE_CONFIG.name,
    description: 'Términos y condiciones de uso.',
    type: 'website',
    url: `${SITE_CONFIG.url}/terminos`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/terminos`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TerminosPage() {
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
            <li className="text-gray-900 font-medium">Términos de Uso</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Términos de <span className="text-primary-600">Uso</span>
            </h1>
            <p className="text-lg text-gray-600">
              Última actualización: {new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <h2>1. Aceptación de los términos</h2>
              <p>
                Al acceder y utilizar {SITE_CONFIG.name}, aceptas cumplir con estos términos de uso y todas las leyes y regulaciones aplicables.
              </p>

              <h2>2. Uso del sitio web</h2>
              <p>
                Este sitio web está destinado para uso personal y no comercial. Puedes:
              </p>
              <ul>
                <li>Navegar y leer el contenido</li>
                <li>Compartir enlaces a nuestros artículos</li>
                <li>Suscribirte a nuestro newsletter</li>
                <li>Contactarnos para sugerencias</li>
              </ul>

              <h2>3. Contenido y propiedad intelectual</h2>
              <p>
                Todo el contenido de este sitio web, incluyendo texto, imágenes, logotipos y diseño, está protegido por derechos de autor y es propiedad de {SITE_CONFIG.name} o sus licenciantes.
              </p>

              <h2>4. Reseñas y opiniones</h2>
              <p>
                Nuestras reseñas reflejan la experiencia y opinión de nuestros críticos en el momento de la visita. Los restaurantes y locales pueden cambiar con el tiempo, por lo que las experiencias futuras pueden variar.
              </p>

              <h2>5. Responsabilidad</h2>
              <p>
                {SITE_CONFIG.name} no se hace responsable de:
              </p>
              <ul>
                <li>Cambios en los establecimientos reseñados</li>
                <li>Experiencias que difieran de nuestras reseñas</li>
                <li>Decisiones tomadas basándose en nuestro contenido</li>
              </ul>

              <h2>6. Comentarios y contribuciones</h2>
              <p>
                Si envías comentarios o sugerencias, nos otorgas el derecho no exclusivo de usar, modificar y publicar dicho contenido. Mantenemos el derecho de moderar y eliminar contenido inapropiado.
              </p>

              <h2>7. Enlaces externos</h2>
              <p>
                Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables del contenido o prácticas de privacidad de estos sitios externos.
              </p>

              <h2>8. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en esta página.
              </p>

              <h2>9. Ley aplicable</h2>
              <p>
                Estos términos se rigen por las leyes españolas. Cualquier disputa será resuelta en los tribunales competentes de España.
              </p>

              <h2>10. Contacto</h2>
              <p>
                Si tienes preguntas sobre estos términos de uso, puedes contactarnos a través de nuestro <Link href="/contacto" className="text-primary-600 hover:text-primary-700">formulario de contacto</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}