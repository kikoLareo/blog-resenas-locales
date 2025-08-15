import { 
  Venue, 
  Review, 
  Post,
  FAQ,
  LocalBusinessJsonLd,
  ReviewJsonLd,
  ArticleJsonLd,
  FAQJsonLd,
  BreadcrumbJsonLd,
} from './types';
import { SITE_CONFIG } from './constants';

/**
 * Generate LocalBusiness JSON-LD for venues
 */
export function localBusinessJsonLd(venue: Venue): LocalBusinessJsonLd {
  const baseUrl = SITE_CONFIG.url;
  const id = `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}#business`;
  
  // Generar URLs de imágenes
  const images = venue.images?.map(img => img.asset.url).filter(Boolean) || [];
  
  // Mapear categorías a tipos de cocina
  const servesCuisine = venue.categories?.map(cat => cat.title) || [];
  
  const schema: LocalBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': venue.schemaType || 'LocalBusiness',
    '@id': id,
    name: venue.title,
    description: venue.description,
    image: images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      addressLocality: venue.city.title,
      addressRegion: venue.city.region,
      postalCode: venue.postalCode,
      addressCountry: 'ES',
    },
    telephone: venue.phone,
    url: `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}`,
    openingHours: venue.openingHours,
    priceRange: venue.priceRange,
    servesCuisine,
  };

  // Agregar coordenadas GPS si están disponibles
  if (venue.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: venue.geo.lat,
      longitude: venue.geo.lng,
    };
  }

  // Agregar rating agregado si hay reseñas
  if (venue.avgRating && venue.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: venue.avgRating,
      reviewCount: venue.reviewCount,
      bestRating: 10,
      worstRating: 0,
    };
  }

  // Agregar redes sociales
  const socialLinks = [
    venue.social?.instagram,
    venue.social?.facebook,
    venue.social?.tiktok,
    venue.social?.maps,
    venue.website,
  ].filter((v): v is string => typeof v === 'string' && v.length > 0);

  if (socialLinks.length > 0) {
    schema.sameAs = socialLinks;
  }

  return schema;
}

/**
 * Generate Review JSON-LD
 */
export function reviewJsonLd(review: Review, venue: Venue): ReviewJsonLd {
  // Calcular rating promedio (normalizado a 1-5)
  const avgRating = (
    review.ratings.food + 
    review.ratings.service + 
    review.ratings.ambience + 
    review.ratings.value
  ) / 4;
  const rating5 = Math.round(((avgRating / 10) * 5) * 10) / 10; // un decimal
  const baseUrl = SITE_CONFIG.url;
  const reviewUrl = `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}/review-${review.slug.current}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${reviewUrl}#review`,
    url: reviewUrl,
    headline: review.title,
    itemReviewed: {
      '@type': venue.schemaType || 'LocalBusiness',
      name: venue.title,
      image: venue.images?.[0]?.asset.url,
      address: {
        '@type': 'PostalAddress',
        streetAddress: venue.address,
        addressLocality: venue.city.title,
        addressRegion: venue.city.region,
        addressCountry: 'ES',
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating5,
      bestRating: 5,
      worstRating: 1,
    },
    name: review.title,
    author: {
      '@type': 'Person',
      name: review.author,
      image: review.authorAvatar?.asset.url,
    },
    reviewBody: review.tldr,
    datePublished: review.publishedAt,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };
}

/**
 * Generate Article/BlogPosting JSON-LD for reviews
 */
export function articleJsonLd(post: Post): ArticleJsonLd {
  const baseUrl = SITE_CONFIG.url;
  const url = `${baseUrl}/blog/${post.slug.current}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt || '',
    image: post.cover?.asset?.url ? [post.cover.asset.url] : undefined,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    keywords: post.tags?.join(', '),
  };
}

/**
 * Generate FAQPage JSON-LD
 */
export function faqJsonLd(faqs: FAQ[]): FAQJsonLd | null {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function breadcrumbsJsonLd(
  items: Array<{ name: string; url: string }>
): BreadcrumbJsonLd {
  const baseUrl = SITE_CONFIG.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Generate WebSite JSON-LD with search action
 */
export function websiteJsonLd() {
  const baseUrl = SITE_CONFIG.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: baseUrl,
    },
  };
}

/**
 * Generate Organization JSON-LD
 */
export function organizationJsonLd() {
  const baseUrl = SITE_CONFIG.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,
    name: SITE_CONFIG.name,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      // Add social media URLs here
    ],
  };
}

/**
 * Generate ItemList JSON-LD for review listings
 */
export function itemListJsonLd(
  reviews: Review[],
  listName: string,
  description?: string
) {
  const baseUrl = SITE_CONFIG.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description,
    numberOfItems: reviews.length,
    itemListElement: reviews.map((review, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        name: review.title,
        url: `${baseUrl}/${review.venue.city.slug.current}/${review.venue.slug.current}/${review.slug.current}`,
        datePublished: review.publishedAt,
        author: {
          '@type': 'Person',
          name: review.author,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: (
            review.ratings.food + 
            review.ratings.service + 
            review.ratings.ambience + 
            review.ratings.value
          ) / 4,
          bestRating: 10,
          worstRating: 0,
        },
      },
    })),
  };
}

/**
 * Generate CollectionPage JSON-LD for city/category pages
 */
export function collectionPageJsonLd(
  title: string,
  description: string,
  url: string,
  items: Venue[] | Review[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'title' in item ? 'LocalBusiness' : 'Article',
          name: item.title,
          url: 'city' in item 
            ? `${SITE_CONFIG.url}/${item.city.slug.current}/${item.slug.current}`
            : `${SITE_CONFIG.url}/${(item as Review).venue.city.slug.current}/${(item as Review).venue.slug.current}/${item.slug.current}`,
        },
      })),
    },
  };
}

/**
 * Generate complete page JSON-LD for review pages
 */
export function reviewPageJsonLd(review: Review, venue: Venue) {
  const schemas: (object | null)[] = [
    localBusinessJsonLd(venue),
    reviewJsonLd(review, venue),
  ];

  // Agregar FAQ si existe
  if (review.faq && review.faq.length > 0) {
    schemas.push(faqJsonLd(review.faq));
  }

  // Generar breadcrumbs
  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: venue.city.title, url: `/${venue.city.slug.current}` },
    { name: venue.title, url: `/${venue.city.slug.current}/${venue.slug.current}` },
    { name: review.title, url: `/${venue.city.slug.current}/${venue.slug.current}/${review.slug.current}` },
  ];
  schemas.push(breadcrumbsJsonLd(breadcrumbs));

  return combineJsonLd(...schemas);
}

/**
 * Generate complete page JSON-LD for venue pages
 */
export function venuePageJsonLd(venue: Venue, recentReviews?: Review[]) {
  const schemas: object[] = [
    localBusinessJsonLd(venue),
  ];

  // Generar breadcrumbs
  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: venue.city.title, url: `/${venue.city.slug.current}` },
    { name: venue.title, url: `/${venue.city.slug.current}/${venue.slug.current}` },
  ];
  schemas.push(breadcrumbsJsonLd(breadcrumbs));

  // Agregar lista de reseñas si existen
  if (recentReviews && recentReviews.length > 0) {
    schemas.push(itemListJsonLd(
      recentReviews,
      `Reseñas de ${venue.title}`,
      `Las mejores reseñas de ${venue.title} en ${venue.city.title}`
    ));
  }

  return combineJsonLd(...schemas);
}

/**
 * Utility to combine multiple JSON-LD objects
 */
export function combineJsonLd(...schemas: (object | null | undefined)[]) {
  const validSchemas = schemas.filter(Boolean);
  
  if (validSchemas.length === 0) return null;
  if (validSchemas.length === 1) return validSchemas[0];
  
  return {
    '@context': 'https://schema.org',
    '@graph': validSchemas,
  };
}
