import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DefaultSeo } from 'next-seo';
import '@/styles/globals.css';
import { SITE_CONFIG, SEO_DEFAULTS } from '@/lib/constants';
import { websiteJsonLd, organizationJsonLd } from '@/lib/schema';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: SEO_DEFAULTS.titleTemplate,
    default: SITE_CONFIG.name,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      websiteJsonLd(),
      organizationJsonLd(),
    ],
  };

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* JSON-LD for website and organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#f3761b" />
        
        {/* Prevent zoom on mobile form inputs */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <nav className="container-wide py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a 
                  href="/" 
                  className="text-xl font-bold text-primary-600 hover:text-primary-700"
                  aria-label="Ir al inicio"
                >
                  {SITE_CONFIG.name}
                </a>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <a href="/categorias" className="text-gray-700 hover:text-primary-600">
                  Categorías
                </a>
                <a href="/blog" className="text-gray-700 hover:text-primary-600">
                  Blog
                </a>
                <a href="/sobre" className="text-gray-700 hover:text-primary-600">
                  Sobre nosotros
                </a>
                <a href="/contacto" className="text-gray-700 hover:text-primary-600">
                  Contacto
                </a>
              </div>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                aria-label="Abrir menú de navegación"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </header>

        {/* Main content */}
        <main id="main-content" className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="container-wide py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">{SITE_CONFIG.name}</h3>
                <p className="text-gray-300 mb-4">
                  {SITE_CONFIG.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Enlaces</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/categorias" className="hover:text-white">Categorías</a></li>
                  <li><a href="/blog" className="hover:text-white">Blog</a></li>
                  <li><a href="/sobre" className="hover:text-white">Sobre nosotros</a></li>
                  <li><a href="/contacto" className="hover:text-white">Contacto</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/politica-privacidad" className="hover:text-white">Política de Privacidad</a></li>
                  <li><a href="/terminos" className="hover:text-white">Términos de Uso</a></li>
                  <li><a href="/cookies" className="hover:text-white">Política de Cookies</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 {SITE_CONFIG.name}. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
