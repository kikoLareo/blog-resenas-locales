import { NextRequest, NextResponse } from 'next/server';
import { sanityFetch } from '@/lib/sanity.client';
import { SITEMAP_URLS_QUERY } from '@/lib/groq';
import { SitemapData, SitemapUrl } from '@/lib/types';
import { SITE_CONFIG } from '@/lib/constants';

// Páginas estáticas del sitio
const STATIC_PAGES = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/blog', priority: 0.8, changefreq: 'daily' },
  { url: '/categorias', priority: 0.7, changefreq: 'weekly' },
  { url: '/sobre', priority: 0.5, changefreq: 'monthly' },
  { url: '/contacto', priority: 0.5, changefreq: 'monthly' },
  { url: '/politica-privacidad', priority: 0.3, changefreq: 'yearly' },
  { url: '/terminos', priority: 0.3, changefreq: 'yearly' },
  { url: '/cookies', priority: 0.3, changefreq: 'yearly' },
];

// Generar URL completa
function getFullUrl(path: string): string {
  return `${SITE_CONFIG.url}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Generar XML para sitemap específico
function generateSitemapXML(urls: Array<{
  url: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}>): string {
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

// Generar sitemap estático
function generateStaticSitemap(): string {
  const urls = STATIC_PAGES.map(page => ({
    url: getFullUrl(page.url),
    lastmod: new Date().toISOString().split('T')[0], // Solo fecha
    changefreq: page.changefreq,
    priority: page.priority,
  }));

  return generateSitemapXML(urls);
}

// Generar sitemap de venues
function generateVenuesSitemap(venues: SitemapUrl[]): string {
  const urls = venues.map(venue => ({
    url: getFullUrl(`/${venue.slug}`), // TODO: Necesita incluir city.slug cuando tengamos datos reales
    lastmod: new Date(venue._updatedAt).toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.8,
  }));

  return generateSitemapXML(urls);
}

// Generar sitemap de reseñas
function generateReviewsSitemap(reviews: SitemapUrl[]): string {
  const urls = reviews.map(review => ({
    url: getFullUrl(`/${review.slug}`), // TODO: Necesita incluir city.slug/venue.slug cuando tengamos datos reales
    lastmod: review.publishedAt 
      ? new Date(review.publishedAt).toISOString().split('T')[0]
      : new Date(review._updatedAt).toISOString().split('T')[0],
    changefreq: 'monthly' as const,
    priority: 0.9,
  }));

  return generateSitemapXML(urls);
}

// Generar sitemap de ciudades
function generateCitiesSitemap(cities: SitemapUrl[]): string {
  const urls = cities.map(city => ({
    url: getFullUrl(`/${city.slug}`),
    lastmod: new Date(city._updatedAt).toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.7,
  }));

  return generateSitemapXML(urls);
}

// Generar sitemap de categorías
function generateCategoriesSitemap(categories: SitemapUrl[]): string {
  const urls = categories.map(category => ({
    url: getFullUrl(`/categorias/${category.slug}`),
    lastmod: new Date(category._updatedAt).toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.6,
  }));

  return generateSitemapXML(urls);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    let sitemapXML: string;

    // Generar sitemap según el tipo
    switch (type) {
      case 'static':
        sitemapXML = generateStaticSitemap();
        break;

      case 'venues':
      case 'reviews':
      case 'cities':
      case 'categories':
        // Obtener datos de Sanity
        const data = await sanityFetch<SitemapData>({
          query: SITEMAP_URLS_QUERY,
          tags: ['sitemap'],
          revalidate: 3600, // 1 hora
        });

        switch (type) {
          case 'venues':
            sitemapXML = generateVenuesSitemap(data.venues);
            break;
          case 'reviews':
            sitemapXML = generateReviewsSitemap(data.reviews);
            break;
          case 'cities':
            sitemapXML = generateCitiesSitemap(data.cities);
            break;
          case 'categories':
            sitemapXML = generateCategoriesSitemap(data.categories);
            break;
          default:
            throw new Error(`Tipo de sitemap no válido: ${type}`);
        }
        break;

      default:
        return NextResponse.json(
          { error: `Tipo de sitemap no válido: ${type}` },
          { status: 404 }
        );
    }

    return new Response(sitemapXML, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error generando sitemap ${params.type}:`, error);
    
    return NextResponse.json(
      { 
        error: 'Error generando sitemap',
        type: params.type,
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
