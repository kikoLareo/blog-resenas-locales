import { Metadata } from 'next';

/**
 * Configuración de protección SEO para páginas administrativas
 */
export const ADMIN_METADATA: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    nosnippet: true,
    noimageindex: true,
    notranslate: true,
  },
  alternates: {
    canonical: null, // Prevenir canonical URL
  },
};

/**
 * Headers de seguridad para páginas administrativas
 */
export const ADMIN_SECURITY_HEADERS = {
  'X-Robots-Tag': 'noindex, nofollow, nosnippet, noarchive, noimageindex',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
} as const;

/**
 * Rutas que deben ser bloqueadas en robots.txt
 */
export const BLOCKED_PATHS = [
  '/dashboard/',
  '/admin/',
  '/studio/',
  '/api/',
  '/_next/',
  '/acceso',
] as const;

/**
 * Verificar si una ruta es administrativa
 */
export function isAdminRoute(pathname: string): boolean {
  return BLOCKED_PATHS.some(path => {
    // Manejar casos especiales como /acceso que no termina en /
    if (!path.endsWith('/')) {
      return pathname === path || pathname.startsWith(path + '/');
    }
    // Para rutas que terminan en /, verificar si el pathname comienza con ellas
    return pathname.startsWith(path.slice(0, -1));
  });
}

/**
 * Generar metadata de protección SEO para páginas administrativas
 */
export function createAdminMetadata(title: string): Metadata {
  return {
    title,
    ...ADMIN_METADATA,
  };
}
