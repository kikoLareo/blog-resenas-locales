import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity.client';
import { ListDetail } from '@/components';
import { generateListSchema } from '@/lib/seo-schemas';
import { SITE_CONFIG } from '@/lib/constants';

// GROQ query for list data
const listQuery = `
  *[_type == "list" && slug.current == $slug && city->slug.current == $city][0] {
    _id,
    title,
    slug,
    excerpt,
    listType,
    dish,
    city->{
      title,
      slug
    },
    neighborhoods,
    priceRange,
    occasion,
    heroImage{
      asset->{url},
      alt
    },
    introduction,
    criteria,
    rankedVenues[]{
      position,
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
      score,
      highlight,
      bestDish,
      priceNote,
      specialNote
    },
    comparisonTable,
    verdict,
    faq,
    relatedGuides[]->{
      title,
      slug
    },
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
  
  const list = await sanityFetch<any>({
    query: listQuery,
    params: { slug, city },
    revalidate: 3600,
    tags: ['list'],
  }).catch(() => null);

  if (!list || !list.published) {
    return {
      title: 'Ranking no encontrado',
      description: 'El ranking que buscas no existe o no está disponible.',
    };
  }

  const venueCount = list.rankedVenues?.length || 0;
  const dishText = list.dish ? ` de ${list.dish}` : '';

  const seoTitle = list.seoTitle || `${list.title} | ${list.city.title} | ${SITE_CONFIG.name}`;
  const seoDescription = list.seoDescription || 
    `${list.excerpt} Ranking con ${venueCount} locales${dishText} en ${list.city.title}.`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      list.city.title,
      list.dish,
      'ranking',
      'mejores',
      'top',
      'restaurantes',
      'comparativa',
      ...(list.keywords || [])
    ].filter(Boolean),
    alternates: {
      canonical: `${SITE_CONFIG.url}/${city}/rankings/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: `${SITE_CONFIG.url}/${city}/rankings/${slug}`,
      images: [
        {
          url: list.heroImage.asset.url,
          width: 1200,
          height: 630,
          alt: list.heroImage.alt,
        },
      ],
      publishedTime: list.publishedAt,
      modifiedTime: list.lastUpdated,
      authors: [SITE_CONFIG.name],
      section: 'Rankings Gastronómicos',
      tags: list.keywords || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [list.heroImage.asset.url],
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

export default async function ListPage({ params }: PageProps) {
  const { city, slug } = await params;

  const list = await sanityFetch<any>({
    query: listQuery,
    params: { slug, city },
    revalidate: 3600,
    tags: ['list'],
  }).catch(() => null);

  if (!list || !list.published) {
    notFound();
  }

  // Generate JSON-LD schemas
  const schemas = generateListSchema({
    title: list.title,
    description: list.excerpt,
    url: `${SITE_CONFIG.url}/${city}/rankings/${slug}`,
    image: list.heroImage.asset.url,
    city: list.city.title,
    dish: list.dish,
    rankedVenues: list.rankedVenues || [],
    faq: list.faq,
    publishedAt: list.publishedAt,
    lastUpdated: list.lastUpdated,
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
      
      <ListDetail list={list} />
    </>
  );
}

// Generate static params for build time
export async function generateStaticParams() {
  // In a real implementation, you would fetch all published lists
  return [];
}
