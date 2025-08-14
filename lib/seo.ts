import { NextSeoProps } from 'next-seo';
import { Venue, Review, City, Category, SEOData, SanityImage } from './types';
import { SITE_CONFIG } from './constants';

/**
 * Generate SEO configuration for venue pages
 */
export function generateVenueSEO(venue: Venue): NextSeoProps {
  const title = `${venue.title} en ${venue.city.title} - Reseña completa`;
  const description = venue.description || 
    `Descubre ${venue.title} en ${venue.city.title}. Información completa, horarios, precios y reseñas honestas. ${venue.priceRange} • ${venue.categories.map(c => c.title).join(', ')}`;
  
  const url = `${SITE_CONFIG.url}/${venue.city.slug.current}/${venue.slug.current}`;
  const images = venue.images?.map(img => ({
    url: img.asset.url,
    alt: img.alt || venue.title,
    width: 1200,
    height: 800,
  })) || [];

  return {
    title,
    description: description.slice(0, 160),
    canonical: url,
    openGraph: {
      title,
      description: description.slice(0, 160),
      url,
      type: 'website',
      images,
      site_name: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 160),
      images: images.map(img => img.url),
    },
    additionalMetaTags: [
      {
        name: 'geo.region',
        content: 'ES',
      },
      {
        name: 'geo.placename',
        content: `${venue.city.title}, ${venue.city.region}`,
      },
      {
        name: 'geo.position',
        content: venue.geo ? `${venue.geo.lat};${venue.geo.lng}` : '',
      },
      {
        name: 'ICBM',
        content: venue.geo ? `${venue.geo.lat}, ${venue.geo.lng}` : '',
      },
      {
        name: 'keywords',
        content: [
          venue.title,
          venue.city.title,
          ...venue.categories.map(c => c.title),
          venue.priceRange,
          'restaurante',
          'reseña',
          'opiniones',
        ].join(', '),
      },
    ],
  };
}

/**
 * Generate SEO configuration for review pages
 */
export function generateReviewSEO(review: Review, venue: Venue): NextSeoProps {
  const avgRating = (
    review.ratings.food + 
    review.ratings.service + 
    review.ratings.ambience + 
    review.ratings.value
  ) / 4;
  
  const ratingText = avgRating >= 8 ? 'Excelente' : avgRating >= 6 ? 'Muy bueno' : avgRating >= 4 ? 'Bueno' : 'Regular';
  
  const title = `${venue.title} - Reseña ${ratingText} (${avgRating}/10) | ${venue.city.title}`;
  const description = review.tldr.slice(0, 160);
  
  const url = `${SITE_CONFIG.url}/${venue.city.slug.current}/${venue.slug.current}/review-${review.slug.current}`;
  const images = review.gallery?.map(img => ({
    url: img.asset.url,
    alt: img.alt || `${venue.title} - ${review.title}`,
    width: 1200,
    height: 800,
  })) || [];

  return {
    title,
    description,
    canonical: url,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images,
      site_name: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      article: {
        publishedTime: review.publishedAt,
        authors: [review.author],
        tags: review.tags,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map(img => img.url),
    },
    additionalMetaTags: [
      {
        name: 'article:author',
        content: review.author,
      },
      {
        name: 'article:published_time',
        content: review.publishedAt,
      },
      {
        name: 'rating',
        content: avgRating.toString(),
      },
      {
        name: 'keywords',
        content: [
          venue.title,
          venue.city.title,
          'reseña',
          'opinión',
          'experiencia',
          ratingText,
          ...(review.tags || []),
        ].join(', '),
      },
    ],
  };
}

/**
 * Generar datos SEO optimizados para cualquier página
 */
export function generateSEOData(config: {
  title: string;
  description: string;
  canonical: string;
  type?: 'website' | 'article';
  images?: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
  }>;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  additionalMeta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}): SEOData {
  const {
    title,
    description,
    canonical,
    type = 'website',
    images = [],
    publishedTime,
    modifiedTime,
    author,
    tags,
    additionalMeta = [],
  } = config;

  // Imagen por defecto si no hay imágenes
  const defaultImage = {
    url: `${SITE_CONFIG.url}/og-default.jpg`,
    width: 1200,
    height: 630,
    alt: title,
  };

  const ogImages = images.length > 0 ? images : [defaultImage];

  return {
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      images: ogImages,
      siteName: SITE_CONFIG.name,
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitter || '@blogresenas',
      creator: SITE_CONFIG.twitter || '@blogresenas',
      title,
      description,
      images: ogImages.map(img => img.url),
    },
    additionalMetaTags: [
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large',
      },
      {
        name: 'googlebot',
        content: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
      },
      {
        property: 'og:locale',
        content: 'es_ES',
      },
      ...(publishedTime ? [{
        property: 'article:published_time',
        content: publishedTime,
      }] : []),
      ...(modifiedTime ? [{
        property: 'article:modified_time',
        content: modifiedTime,
      }] : []),
      ...(author ? [{
        name: 'author',
        content: author,
      }] : []),
      ...(tags && tags.length > 0 ? [{
        name: 'keywords',
        content: tags.join(', '),
      }] : []),
      ...additionalMeta,
    ],
  };
}

/**
 * Generate SEO configuration for city pages
 */
export function generateCitySEO(city: City, venueCount: number): NextSeoProps {
  const title = `Mejores restaurantes y locales en ${city.title}`;
  const description = `Descubre los ${venueCount} mejores restaurantes y locales en ${city.title}${city.region ? `, ${city.region}` : ''}. Reseñas honestas, fotos y toda la información que necesitas.`;
  
  const url = `${SITE_CONFIG.url}/${city.slug.current}`;
  const images = city.heroImage ? [{
    url: city.heroImage.asset.url,
    alt: city.heroImage.alt || `${city.title} - Mejores restaurantes`,
    width: 1200,
    height: 800,
  }] : [];

  return {
    title,
    description: description.slice(0, 160),
    canonical: url,
    openGraph: {
      title,
      description: description.slice(0, 160),
      url,
      type: 'website',
      images,
      site_name: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 160),
      images: images.map(img => img.url),
    },
    additionalMetaTags: [
      {
        name: 'geo.region',
        content: 'ES',
      },
      {
        name: 'geo.placename',
        content: `${city.title}${city.region ? `, ${city.region}` : ''}`,
      },
      {
        name: 'geo.position',
        content: city.geo ? `${city.geo.lat};${city.geo.lng}` : '',
      },
      {
        name: 'keywords',
        content: [
          city.title,
          city.region,
          'restaurantes',
          'locales',
          'reseñas',
          'gastronomía',
          'mejores',
          'opiniones',
        ].filter(Boolean).join(', '),
      },
    ],
  };
}

/**
 * Generate SEO configuration for category pages
 */
export function generateCategorySEO(category: string, city?: string): NextSeoProps {
  const title = city 
    ? `${category} en ${city} - Mejores opciones`
    : `${category} - Mejores locales y restaurantes`;
    
  const description = city
    ? `Descubre los mejores ${category.toLowerCase()} en ${city}. Reseñas completas, fotos y toda la información que necesitas para elegir.`
    : `Explora los mejores ${category.toLowerCase()}. Reseñas honestas, fotos y recomendaciones para tu próxima visita.`;
  
  const url = city 
    ? `${SITE_CONFIG.url}/${city}/categoria/${category.toLowerCase().replace(/\s+/g, '-')}`
    : `${SITE_CONFIG.url}/categorias/${category.toLowerCase().replace(/\s+/g, '-')}`;

  return {
    title,
    description: description.slice(0, 160),
    canonical: url,
    openGraph: {
      title,
      description: description.slice(0, 160),
      url,
      type: 'website',
      site_name: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 160),
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: [
          category,
          city,
          'restaurantes',
          'locales',
          'reseñas',
          'mejores',
          'opiniones',
        ].filter(Boolean).join(', '),
      },
    ],
  };
}

/**
 * Generar URL canónica
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * Optimizar descripción para SEO
 */
export function optimizeDescription(text: string, maxLength: number = 160): string {
  if (!text) return '';
  
  const cleaned = text
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleaned.length <= maxLength) return cleaned;
  
  // Cortar en la última palabra completa antes del límite
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated.substring(0, maxLength - 3)}...`;
}

/**
 * Generar keywords SEO basadas en contexto
 */
export function generateKeywords(context: {
  venue?: Venue;
  city?: City;
  category?: Category;
  review?: Review;
  customKeywords?: string[];
}): string[] {
  const keywords: Set<string> = new Set();
  
  // Keywords base
  const baseKeywords = [
    'restaurante', 'local', 'reseña', 'opinión', 'gastronomía', 'comida'
  ];
  baseKeywords.forEach(k => keywords.add(k));
  
  // Keywords del venue
  if (context.venue) {
    keywords.add(context.venue.title.toLowerCase());
    keywords.add(context.venue.priceRange);
    context.venue.categories.forEach(cat => keywords.add(cat.title.toLowerCase()));
  }
  
  // Keywords de la ciudad
  if (context.city) {
    keywords.add(context.city.title.toLowerCase());
    if (context.city.region) {
      keywords.add(context.city.region.toLowerCase());
    }
  }
  
  // Keywords de la categoría
  if (context.category) {
    keywords.add(context.category.title.toLowerCase());
  }
  
  // Keywords de la reseña
  if (context.review) {
    context.review.tags?.forEach(tag => keywords.add(tag.toLowerCase()));
    if (context.review.highlights) {
      context.review.highlights.forEach(highlight => keywords.add(highlight.toLowerCase()));
    }
  }
  
  // Keywords personalizadas
  if (context.customKeywords) {
    context.customKeywords.forEach(k => keywords.add(k.toLowerCase()));
  }
  
  return Array.from(keywords);
}

/**
 * Generar datos estructurados para breadcrumbs
 */
export function generateBreadcrumbData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : generateCanonicalUrl(item.url),
    })),
  };
}

/**
 * Generar meta tags para geo-localización
 */
export function generateGeoMetaTags(geo?: { lat: number; lng: number }, location?: string) {
  if (!geo && !location) return [];
  
  const tags = [
    {
      name: 'geo.region',
      content: 'ES',
    },
  ];
  
  if (location) {
    tags.push({
      name: 'geo.placename',
      content: location,
    });
  }
  
  if (geo) {
    tags.push(
      {
        name: 'geo.position',
        content: `${geo.lat};${geo.lng}`,
      },
      {
        name: 'ICBM',
        content: `${geo.lat}, ${geo.lng}`,
      }
    );
  }
  
  return tags;
}

/**
 * Convertir imágenes Sanity a formato SEO
 */
export function sanityImageToSEO(
  image: SanityImage, 
  alt?: string, 
  width: number = 1200, 
  height: number = 630
) {
  return {
    url: image.asset.url,
    width,
    height,
    alt: alt || image.alt || 'Imagen',
  };
}

/**
 * Generar múltiples tamaños de imagen para SEO
 */
export function generateImageSizes(image: SanityImage, alt?: string) {
  const baseUrl = image.asset.url;
  const altText = alt || image.alt || 'Imagen';
  
  return [
    {
      url: `${baseUrl}?w=1200&h=630&fit=crop&auto=format`,
      width: 1200,
      height: 630,
      alt: altText,
    },
    {
      url: `${baseUrl}?w=800&h=600&fit=crop&auto=format`,
      width: 800,
      height: 600,
      alt: altText,
    },
    {
      url: `${baseUrl}?w=400&h=300&fit=crop&auto=format`,
      width: 400,
      height: 300,
      alt: altText,
    },
  ];
}

/**
 * Validar y limpiar título SEO
 */
export function optimizeTitle(title: string, maxLength: number = 60): string {
  if (!title) return '';
  
  const cleaned = title.trim();
  
  if (cleaned.length <= maxLength) return cleaned;
  
  // Cortar en la última palabra completa antes del límite
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace)
    : truncated.substring(0, maxLength - 3);
}

/**
 * Generar configuración SEO por defecto
 */
export function generateDefaultSEO(): SEOData {
  return generateSEOData({
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    canonical: SITE_CONFIG.url,
    tags: [
      'restaurantes', 'reseñas', 'gastronomía', 'locales', 
      'opiniones', 'blog', 'comida', 'España'
    ],
  });
}
