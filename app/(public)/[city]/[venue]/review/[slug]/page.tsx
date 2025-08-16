import type { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG } from '@/lib/constants';
import { websiteJsonLd, organizationJsonLd, breadcrumbsJsonLd, reviewPageJsonLd } from '@/lib/schema';
import { client } from '@/lib/sanity.client';
import { reviewQuery } from '@/sanity/lib/queries';
import { ReviewDetail } from '@/components/ReviewDetail';

interface PageProps { params: { city: string; venue: string; slug: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const title = `${decodeURIComponent(params.slug).replace(/-/g, ' ')} | ${SITE_CONFIG.name}`;
  const url = `${SITE_CONFIG.url}/${params.city}/${params.venue}/review/${params.slug}`;
  return {
    title,
    description: `Reseña detallada de ${params.venue} en ${params.city}. Opinión honesta, puntuaciones y pros/contras.`,
    openGraph: { title, url, type: 'article' },
    alternates: { canonical: url },
  };
}

export default async function ReviewPage({ params }: PageProps) {
  // Datos reales desde Sanity (mock si no hay env)
  let reviewData: any = null;
  try {
    reviewData = await client.fetch(reviewQuery, { slug: params.slug });
  } catch {}

  const title = decodeURIComponent(params.slug).replace(/-/g, ' ');
  const url = `${SITE_CONFIG.url}/${params.city}/${params.venue}/review/${params.slug}`;

  const reviewJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${url}#review`,
    url,
    headline: title,
    name: title,
    author: { '@type': 'Person', name: 'María González' },
    reviewRating: { '@type': 'Rating', ratingValue: 4.8, bestRating: 5, worstRating: 1 },
    datePublished: new Date().toISOString(),
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: decodeURIComponent(params.venue).replace(/-/g, ' '),
      address: { '@type': 'PostalAddress', addressLocality: params.city, addressCountry: 'ES' },
    },
    isPartOf: { '@type': 'WebSite', name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  } as const;

  const breadcrumbs = breadcrumbsJsonLd([
    { name: 'Inicio', url: '/' },
    { name: params.city, url: `/${params.city}` },
    { name: params.venue, url: `/${params.city}/${params.venue}` },
    { name: title, url: `/${params.city}/${params.venue}/review/${params.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Script id="ld-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
      <Script id="ld-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <Script id="ld-review" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }} />
      <Script id="ld-breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <ReviewDetail slug={params.slug} review={reviewData} />
    </div>
  );
}


