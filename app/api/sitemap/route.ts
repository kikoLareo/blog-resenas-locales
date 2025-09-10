import { NextResponse } from 'next/server';
import { sanityFetch } from '@/lib/sanity.client';
import { SITEMAP_URLS_QUERY } from '@/lib/groq';
import { SitemapData } from '@/lib/types';
import { SITE_CONFIG } from '@/lib/constants';
import { generateSitemapIndexXML, getLatestDate, formatSitemapDate } from '@/lib/sitemap';

// Generar XML del sitemap principal
async function generateSitemapXML(baseUrl: string): Promise<string> {
  try {
    // Obtener datos para calcular fechas reales de lastmod
    const data = await sanityFetch<SitemapData>({
      query: SITEMAP_URLS_QUERY,
      tags: ['sitemap'],
      revalidate: 3600, // 1 hora
    });

    const sitemaps = [
      { loc: `${baseUrl}/sitemap-static.xml`, lastmod: formatSitemapDate(new Date().toISOString()) },
      { loc: `${baseUrl}/sitemap-venues.xml`, lastmod: formatSitemapDate(getLatestDate(data.venues)) },
      { loc: `${baseUrl}/sitemap-reviews.xml`, lastmod: formatSitemapDate(getLatestDate(data.reviews)) },
      { loc: `${baseUrl}/sitemap-posts.xml`, lastmod: formatSitemapDate(getLatestDate(data.posts)) },
      { loc: `${baseUrl}/sitemap-cities.xml`, lastmod: formatSitemapDate(getLatestDate(data.cities)) },
      { loc: `${baseUrl}/sitemap-categories.xml`, lastmod: formatSitemapDate(getLatestDate(data.categories)) },
    ];
    
    return generateSitemapIndexXML(sitemaps);
  } catch {
    // Fallback con fechas actuales si hay error
    const fallbackDate = formatSitemapDate(new Date().toISOString());
    const fallbackSitemaps = [
      { loc: `${baseUrl}/sitemap-static.xml`, lastmod: fallbackDate },
      { loc: `${baseUrl}/sitemap-venues.xml`, lastmod: fallbackDate },
      { loc: `${baseUrl}/sitemap-reviews.xml`, lastmod: fallbackDate },
      { loc: `${baseUrl}/sitemap-posts.xml`, lastmod: fallbackDate },
      { loc: `${baseUrl}/sitemap-cities.xml`, lastmod: fallbackDate },
      { loc: `${baseUrl}/sitemap-categories.xml`, lastmod: fallbackDate },
    ];
    
    return generateSitemapIndexXML(fallbackSitemaps);
  }
}

export async function GET() {
  try {
    const baseUrl = SITE_CONFIG.url;
    const sitemapXML = await generateSitemapXML(baseUrl);

    return new Response(sitemapXML, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    
    return NextResponse.json(
      { error: 'Error generando sitemap' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
