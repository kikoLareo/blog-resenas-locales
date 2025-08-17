import { NextRequest, NextResponse } from 'next/server';
import { sanityFetch } from '@/lib/sanity.client';
import { SITEMAP_URLS_QUERY } from '@/lib/groq';
import { SitemapData, SitemapUrl } from '@/lib/types';
import { generateSitemapXML, getFullUrl, formatSitemapDate } from '@/lib/sitemap';

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



// Generar sitemap estático
function generateStaticSitemap(): string {
  const urls = STATIC_PAGES.map(page => ({
    url: getFullUrl(page.url),
    lastmod: formatSitemapDate(new Date().toISOString()),
    changefreq: page.changefreq as 'daily' | 'weekly' | 'monthly' | 'yearly',
    priority: page.priority,
  }));

  return generateSitemapXML(urls);
}

// Generar sitemap de venues
function generateVenuesSitemap(venues: SitemapUrl[]): string {
  const urls = venues
    .filter(venue => venue.citySlug && venue.slug) // Solo incluir venues con datos completos
    .map(venue => ({
      url: getFullUrl(`/${venue.citySlug}/${venue.slug}`),
      lastmod: formatSitemapDate(venue._updatedAt),
      changefreq: 'weekly' as const,
      priority: 0.8,
    }));

  return generateSitemapXML(urls);
}

// Generar sitemap de reseñas
function generateReviewsSitemap(reviews: SitemapUrl[]): string {
  const urls = reviews
    .filter(review => review.citySlug && review.venueSlug && review.slug) // Solo incluir reviews con datos completos
    .map(review => ({
      url: getFullUrl(`/${review.citySlug}/${review.venueSlug}/review/${review.slug}`),
      lastmod: formatSitemapDate(review.publishedAt || review._updatedAt),
      changefreq: 'monthly' as const,
      priority: 0.9,
    }));

  return generateSitemapXML(urls);
}

// Generar sitemap de ciudades
function generateCitiesSitemap(cities: SitemapUrl[]): string {
  const urls = cities
    .filter(city => city.slug) // Solo incluir ciudades con slug
    .map(city => ({
      url: getFullUrl(`/${city.slug}`),
      lastmod: formatSitemapDate(city._updatedAt),
      changefreq: 'weekly' as const,
      priority: 0.7,
    }));

  return generateSitemapXML(urls);
}

// Generar sitemap de posts
function generatePostsSitemap(posts: SitemapUrl[]): string {
  const urls = posts
    .filter(post => post.slug) // Solo incluir posts con slug
    .map(post => ({
      url: getFullUrl(`/blog/${post.slug}`),
      lastmod: formatSitemapDate(post.publishedAt || post._updatedAt),
      changefreq: 'monthly' as const,
      priority: 0.7,
    }));

  return generateSitemapXML(urls);
}

// Generar sitemap de categorías
function generateCategoriesSitemap(categories: SitemapUrl[]): string {
  const urls = categories
    .filter(category => category.slug) // Solo incluir categorías con slug
    .map(category => ({
      url: getFullUrl(`/categorias/${category.slug}`),
      lastmod: formatSitemapDate(category._updatedAt),
      changefreq: 'weekly' as const,
      priority: 0.6,
    }));

  return generateSitemapXML(urls);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await context.params;
    let sitemapXML: string;

    // Generar sitemap según el tipo
    switch (type) {
      case 'static':
        sitemapXML = generateStaticSitemap();
        break;

      case 'venues':
      case 'reviews':
      case 'posts':
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
          case 'posts':
            sitemapXML = generatePostsSitemap(data.posts);
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
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generando sitemap:', error);
    
    return NextResponse.json(
      { 
        error: 'Error generando sitemap',
        type: (await context.params).type,
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
