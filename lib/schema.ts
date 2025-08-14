import { Venue, Review, Post, BreadcrumbItem } from './types';
import { SITE_CONFIG } from './constants';

/**
 * Generate LocalBusiness JSON-LD for venues
 */
export function localBusinessJsonLd(venue: Venue) {
  const baseUrl = SITE_CONFIG.url;
  
  return {
    '@context': 'https://schema.org',
    '@type': venue.schemaType || 'LocalBusiness',
    '@id': `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}#business`,
    name: venue.title,
    description: venue.description,
    url: `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}`,
    image: venue.images?.[0]?.asset?.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      postalCode: venue.postalCode,
      addressLocality: venue.city.title,
      addressRegion: venue.city.region || 'España',
      addressCountry: 'ES',
    },
    geo: venue.geo ? {
      '@type': 'GeoCoordinates',
      latitude: venue.geo.lat,
      longitude: venue.geo.lng,
    } : undefined,
    telephone: venue.phone,
    openingHours: venue.openingHours,
    priceRange: venue.priceRange,
    sameAs: [
      venue.social?.instagram,
      venue.social?.facebook,
      venue.social?.tiktok,
      venue.social?.maps,
      venue.website,
    ].filter(Boolean),
  };
}

/**
 * Generate Review JSON-LD
 */
export function reviewJsonLd(review: Review, venue: Venue) {
  const baseUrl = SITE_CONFIG.url;
  const avgRating = (
    review.ratings.food + 
    review.ratings.service + 
    review.ratings.ambience + 
    review.ratings.value
  ) / 4;

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}/review-${review.slug.current}#review`,
    itemReviewed: localBusinessJsonLd(venue),
    author: {
      '@type': 'Person',
      name: review.author,
      image: review.authorAvatar?.asset?.url,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: Math.round((avgRating / 10) * 5 * 10) / 10, // Convert 0-10 to 0-5 scale
      bestRating: 5,
      worstRating: 1,
    },
    datePublished: review.publishedAt,
    reviewBody: review.tldr,
    url: `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}/review-${review.slug.current}`,
    headline: review.title,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: baseUrl,
    },
  };
}

/**
 * Generate Article/BlogPosting JSON-LD
 */
export function articleJsonLd(post: Post) {
  const baseUrl = SITE_CONFIG.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${baseUrl}/blog/${post.slug.current}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.cover?.asset?.url,
    url: `${baseUrl}/blog/${post.slug.current}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
      image: post.authorAvatar?.asset?.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug.current}`,
    },
    keywords: post.tags?.join(', '),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: baseUrl,
    },
  };
}

/**
 * Generate FAQPage JSON-LD
 */
export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
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
export function breadcrumbsJsonLd(items: BreadcrumbItem[]) {
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
