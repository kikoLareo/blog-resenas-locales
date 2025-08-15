import { NextRequest, NextResponse } from 'next/server';
import { sanityFetch } from '@/lib/sanity.client';
import { sitemapVenuesQuery, sitemapReviewsQuery, sitemapPostsQuery } from '@/lib/groq';
import { SITE_CONFIG } from '@/lib/constants';

type SitemapType = 'venues' | 'reviews' | 'posts' | 'static';

export async function GET(
  req: NextRequest,
  { params }: { params: { type: SitemapType } }
) {
  const { type } = params;
  const baseUrl = SITE_CONFIG.url;

  try {
    let urls: string[] = [];

    switch (type) {
      case 'static':
        // Páginas estáticas
        urls = [
          `<url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
          `<url><loc>${baseUrl}/sobre</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
          `<url><loc>${baseUrl}/contacto</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
          `<url><loc>${baseUrl}/politica-privacidad</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>`,
        ];
        break;

      case 'venues':
        const venues = await sanityFetch({
          query: sitemapVenuesQuery,
          tags: ['sitemap-venues', 'venues'],
        });

        urls = venues.map((venue: { slug: string; _updatedAt: string; city: { slug: string } }) => {
          const url = `${baseUrl}/${venue.city.slug}/${venue.slug}`;
          const lastmod = new Date(venue._updatedAt).toISOString();
          return `<url><loc>${url}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        });
        break;

      case 'reviews':
        const reviews = await sanityFetch({
          query: sitemapReviewsQuery,
          tags: ['sitemap-reviews', 'reviews'],
        });

        urls = reviews.map((review: { visitDate: string; _updatedAt: string; venue: { slug: string; city: { slug: string } } }) => {
          const dateStr = new Date(review.visitDate).toISOString().slice(0, 7); // YYYY-MM
          const url = `${baseUrl}/${review.venue.city.slug}/${review.venue.slug}/review-${dateStr}`;
          const lastmod = new Date(review._updatedAt).toISOString();
          return `<url><loc>${url}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>`;
        });
        break;

      case 'posts':
        const posts = await sanityFetch({
          query: sitemapPostsQuery,
          tags: ['sitemap-posts', 'posts'],
        });

        urls = posts.map((post: { slug: string; _updatedAt: string }) => {
          const url = `${baseUrl}/blog/${post.slug}`;
          const lastmod = new Date(post._updatedAt).toISOString();
          return `<url><loc>${url}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid sitemap type' }, { status: 404 });
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error(`Error generating ${type} sitemap:`, error);
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 });
  }
}