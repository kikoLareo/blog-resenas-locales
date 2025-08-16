// Utilidades para generación de sitemaps XML
import { SITE_CONFIG } from '@/lib/constants';

export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Generar URL completa
export function getFullUrl(path: string): string {
  const baseUrl = SITE_CONFIG.url;
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Generar XML para sitemap específico
export function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlsXML = urls.map(({ url, lastmod, changefreq, priority }) => {
    return `  <url>
    <loc>${url}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
    ${priority ? `<priority>${priority}</priority>` : ''}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
}

// Generar XML para sitemap index
export function generateSitemapIndexXML(sitemaps: Array<{ loc: string; lastmod: string }>): string {
  const sitemapsXML = sitemaps.map(({ loc, lastmod }) => {
    return `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXML}
</sitemapindex>`;
}

// Obtener la fecha más reciente de un array de items
export function getLatestDate(items: Array<{ _updatedAt: string; publishedAt?: string }>): string {
  if (items.length === 0) {
    return new Date().toISOString();
  }
  
  const dates = items.map(item => 
    new Date(item.publishedAt || item._updatedAt).getTime()
  );
  
  return new Date(Math.max(...dates)).toISOString();
}

// Formatear fecha para sitemap (solo fecha, sin hora)
export function formatSitemapDate(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}
