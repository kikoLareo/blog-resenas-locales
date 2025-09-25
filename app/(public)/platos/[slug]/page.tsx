import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity.client';
import { DishGuideDetail } from '@/components';
import { generateDishGuideSchema } from '@/lib/seo-schemas';
import { SITE_CONFIG } from '@/lib/constants';

// GROQ query for dish guide data
const dishGuideQuery = `
  *[_type == "dish-guide" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    dishName,
    excerpt,
    heroImage{
      asset->{url},
      alt
    },
    origin,
    description,
    howToEat,
    variations,
    ingredients,
    seasonality,
    bestVenues[]{
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
        }
      },
      position,
      specialNote,
      price
    },
    relatedRecipes[]->{
      title,
      slug
    },
    relatedLists[]->{
      title,
      slug
    },
    faq,
    publishedAt,
    published
  }
`;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const dishGuide = await sanityFetch<any>({
    query: dishGuideQuery,
    params: { slug },
    revalidate: 3600,
    tags: ['dish-guide'],
  }).catch(() => null);

  if (!dishGuide || !dishGuide.published) {
    return {
      title: 'Guía de plato no encontrada',
      description: 'La guía de plato que buscas no existe o no está disponible.',
    };
  }

  const venueCount = dishGuide.bestVenues?.length || 0;
  const variationCount = dishGuide.variations?.length || 0;

  const seoTitle = dishGuide.seoTitle || `${dishGuide.title} | Guía Completa | ${SITE_CONFIG.name}`;
  const seoDescription = dishGuide.seoDescription || 
    `${dishGuide.excerpt} Descubre todo sobre ${dishGuide.dishName}: origen, variantes y los ${venueCount} mejores sitios para probarlo.`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      dishGuide.dishName,
      'qué es',
      'cómo comer',
      'dónde probar',
      'plato tradicional',
      'gastronomía',
      ...(dishGuide.ingredients || []),
      ...(dishGuide.keywords || [])
    ].filter(Boolean),
    alternates: {
      canonical: `${SITE_CONFIG.url}/platos/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: `${SITE_CONFIG.url}/platos/${slug}`,
      images: [
        {
          url: dishGuide.heroImage.asset.url,
          width: 1200,
          height: 630,
          alt: dishGuide.heroImage.alt,
        },
      ],
      publishedTime: dishGuide.publishedAt,
      authors: [SITE_CONFIG.name],
      section: 'Guías de Platos',
      tags: [dishGuide.dishName, ...(dishGuide.ingredients || [])],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [dishGuide.heroImage.asset.url],
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

export default async function DishGuidePage({ params }: PageProps) {
  const { slug } = await params;

  const dishGuide = await sanityFetch<any>({
    query: dishGuideQuery,
    params: { slug },
    revalidate: 3600,
    tags: ['dish-guide'],
  }).catch(() => null);

  if (!dishGuide || !dishGuide.published) {
    notFound();
  }

  // Generate JSON-LD schemas
  const schemas = generateDishGuideSchema({
    title: dishGuide.title,
    description: dishGuide.excerpt,
    url: `${SITE_CONFIG.url}/platos/${slug}`,
    image: dishGuide.heroImage.asset.url,
    dishName: dishGuide.dishName,
    ingredients: dishGuide.ingredients || [],
    bestVenues: dishGuide.bestVenues || [],
    faq: dishGuide.faq,
    publishedAt: dishGuide.publishedAt,
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
      
      <DishGuideDetail dishGuide={dishGuide} />
    </>
  );
}

// Generate static params for build time
export async function generateStaticParams() {
  // In a real implementation, you would fetch all published dish guides
  return [];
}
