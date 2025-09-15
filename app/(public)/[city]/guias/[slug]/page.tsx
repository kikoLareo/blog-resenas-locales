import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity.client';
import { GuideDetail } from '@/components';
import { generateGuideSchema, injectSchemas } from '@/lib/seo-schemas';
import { SITE_CONFIG } from '@/lib/constants';

// GROQ query for guide data
const guideQuery = `
  *[_type == "guide" && slug.current == $slug && city->slug.current == $city][0] {
    _id,
    title,
    slug,
    excerpt,
    type,
    city->{
      title,
      slug
    },
    neighborhood,
    theme,
    heroImage{
      asset->{url},
      alt,
      caption
    },
    introduction,
    sections[]{
      sectionTitle,
      description,
      venues[]{
        venue->{
          _id,
          title,
          slug,
          address,
          priceRange,
          images[]{
            asset->{url},
            alt
          },
          categories[]->{
            title,
            slug
          },
          geo
        },
        position,
        highlight,
        note
      }
    },
    mapData,
    faq,
    lastUpdated,
    publishedAt,
    published
  }
`;

interface PageProps {
  params: Promise<{
    city: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, slug } = await params;
  
  const guide = await sanityFetch<any>({
    query: guideQuery,
    params: { slug, city },
    revalidate: 3600,
    tags: ['guide'],
  }).catch(() => null);

  if (!guide || !guide.published) {
    return {
      title: 'Guía no encontrada',
      description: 'La guía que buscas no existe o no está disponible.',
    };
  }

  const totalVenues = guide.sections?.reduce((acc: number, section: any) => 
    acc + (section.venues?.length || 0), 0
  ) || 0;

  const seoTitle = guide.seoTitle || `${guide.title} | ${guide.city.title} | ${SITE_CONFIG.name}`;
  const seoDescription = guide.seoDescription || 
    `${guide.excerpt} Descubre ${totalVenues} locales recomendados en ${guide.city.title}.`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      guide.city.title,
      guide.neighborhood,
      guide.theme,
      'guía gastronómica',
      'dónde comer',
      'restaurantes',
      'mejores locales',
      ...(guide.keywords || [])
    ].filter(Boolean),
    alternates: {
      canonical: `${SITE_CONFIG.url}/${city}/guias/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: `${SITE_CONFIG.url}/${city}/guias/${slug}`,
      images: [
        {
          url: guide.heroImage.asset.url,
          width: 1200,
          height: 630,
          alt: guide.heroImage.alt,
        },
      ],
      publishedTime: guide.publishedAt,
      modifiedTime: guide.lastUpdated,
      authors: [SITE_CONFIG.name],
      section: 'Guías Gastronómicas',
      tags: guide.keywords || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [guide.heroImage.asset.url],
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
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { city, slug } = await params;

  const guide = await sanityFetch<any>({
    query: guideQuery,
    params: { slug, city },
    revalidate: 3600,
    tags: ['guide'],
  }).catch(() => null);

  if (!guide || !guide.published) {
    notFound();
  }

  // Generate JSON-LD schemas
  const schemas = generateGuideSchema({
    title: guide.title,
    description: guide.excerpt,
    url: `${SITE_CONFIG.url}/${city}/guias/${slug}`,
    image: guide.heroImage.asset.url,
    city: guide.city.title,
    sections: guide.sections || [],
    faq: guide.faq,
    publishedAt: guide.publishedAt,
    lastUpdated: guide.lastUpdated,
  });

  return (
    <>
      {/* Inject JSON-LD schemas */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
      
      <GuideDetail guide={guide} />
    </>
  );
}

// Generate static params for build time
export async function generateStaticParams() {
  // In a real implementation, you would fetch all published guides
  // For now, return empty array to generate on-demand
  return [];
}
