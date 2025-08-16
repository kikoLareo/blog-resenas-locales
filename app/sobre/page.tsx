import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description: 'Conoce más sobre nuestro equipo y nuestra misión de ayudarte a descubrir los mejores restaurantes y locales.',
  openGraph: {
    title: 'Sobre nosotros | ' + SITE_CONFIG.name,
    description: 'Conoce más sobre nuestro equipo y nuestra misión.',
    type: 'website',
    url: `${SITE_CONFIG.url}/sobre`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/sobre`,
  },
};

export default function SobrePage() {
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
            <li className="text-gray-900 font-medium">Sobre nosotros</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sobre <span className="text-primary-600">Nosotros</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Somos un equipo apasionado por la gastronomía que se dedica a descubrir y compartir los mejores locales y restaurantes.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12 mb-12">
            <div className="prose prose-lg max-w-none">
              <h2>Nuestra Misión</h2>
              <p>
                En {SITE_CONFIG.name}, creemos que una buena comida es mucho más que alimentarse. Es cultura, tradición, arte y, sobre todo, una experiencia que conecta personas. Nuestra misión es ayudarte a descubrir esos lugares especiales que hacen que cada comida sea memorable.
              </p>

              <h2>¿Qué nos hace diferentes?</h2>
              <ul>
                <li><strong>Reseñas honestas:</strong> Visitamos cada local de forma anónima y pagamos nuestras propias cuentas.</li>
                <li><strong>Criterios claros:</strong> Evaluamos comida, servicio, ambiente y relación calidad-precio con transparencia.</li>
                <li><strong>Enfoque local:</strong> Nos especializamos en la gastronomía española y sus tradiciones regionales.</li>
                <li><strong>Comunidad:</strong> Valoramos las opiniones de nuestros lectores y fomentamos el diálogo.</li>
              </ul>

              <h2>Nuestro Proceso</h2>
              <p>
                Cada reseña pasa por un riguroso proceso de evaluación. Visitamos los locales en diferentes momentos y días, probamos varios platos representativos, y documentamos cada aspecto de la experiencia. Nuestros críticos gastronómicos tienen años de experiencia y conocimiento profundo de la cocina local.
              </p>

              <h2>El Equipo</h2>
              <p>
                Somos un equipo multidisciplinar de periodistas gastronómicos, chefs, sumilleres y amantes de la buena mesa. Cada miembro aporta su experiencia única para ofrecer perspectivas completas y equilibradas.
              </p>

              <h2>Contacto</h2>
              <p>
                ¿Tienes alguna sugerencia o quieres que visitemos un local específico? No dudes en <Link href="/contacto" className="text-primary-600 hover:text-primary-700">contactarnos</Link>. Valoramos todas las recomendaciones de nuestra comunidad.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Quieres estar al día?
              </h3>
              <p className="text-gray-600 mb-6">
                Suscríbete a nuestro newsletter para recibir las últimas reseñas y recomendaciones.
              </p>
              <Link
                href="/#newsletter"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Suscribirse al Newsletter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}