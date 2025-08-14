import { NextResponse } from 'next/server';
import { sanityFetch } from '@/lib/sanity.client';
import { SITEMAP_URLS_QUERY } from '@/lib/groq';
import { SitemapData } from '@/lib/types';
import { SITE_CONFIG } from '@/lib/constants';

// Generar XML del sitemap principal
function generateSitemapXML(baseUrl: string): string {
  const lastmod = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/api/sitemap/static</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap/venues</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap/reviews</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap/cities</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap/categories</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
}

export async function GET() {
  try {
    const baseUrl = SITE_CONFIG.url;
    const sitemapXML = generateSitemapXML(baseUrl);

    return new Response(sitemapXML, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generando sitemap principal:', error);
    
    return NextResponse.json(
      { error: 'Error generando sitemap' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';