import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { SITE_CONFIG, SEO_DEFAULTS } from '@/lib/constants';
import { websiteJsonLd, organizationJsonLd } from '@/lib/schema';
import ConsentBanner from '@/components/ConsentBanner';

// Optimización de fuentes con display=swap para evitar CLS
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

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
    creator: '@blogresenas',
    site: '@blogresenas',
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
  // Optimizaciones de rendimiento
  other: {
    'X-DNS-Prefetch-Control': 'on',
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
        
        {/* DNS Prefetch para dominios externos */}
        <link rel="dns-prefetch" href="//cdn.sanity.io" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload recursos críticos */}
        <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
        <link rel="preload" href="/apple-touch-icon.png" as="image" type="image/png" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#f3761b" />
        
        {/* Prevent zoom on mobile form inputs */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        
        {/* Performance optimizations */}
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
      </head>
      <body className={`${inter.className} antialiased  bg-black`}>
        <AuthProvider>
          <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID || 'G-XSLBYXBEZJ'} />
          <PerformanceMonitor />
          {/* Skip link for accessibility */}
          <a href="#main-content" className="skip-link">
            Saltar al contenido principal
          </a>
          
          <Header />

          {/* Main content */}
          <main id="main-content" className="min-h-screen">
            {children}
          </main>

          <Footer />

          {/* Consent Banner */}
          <ConsentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
