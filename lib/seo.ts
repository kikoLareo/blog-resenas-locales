import { NextSeoProps } from 'next-seo';
import { Venue, Review, Post, City } from './types';
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
 * Generate SEO configuration for blog posts
 */
export function generatePostSEO(post: Post): NextSeoProps {
  const title = post.title;
  const description = post.excerpt || 'Artículo del blog sobre gastronomía y locales.';
  const url = `${SITE_CONFIG.url}/blog/${post.slug.current}`;
  
  const images = post.cover ? [{
    url: post.cover.asset.url,
    alt: post.cover.alt || post.title,
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
      type: 'article',
      images,
      site_name: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      article: {
        publishedTime: post.publishedAt,
        authors: [post.author],
        tags: post.tags,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 160),
      images: images.map(img => img.url),
    },
    additionalMetaTags: [
      {
        name: 'article:author',
        content: post.author,
      },
      {
        name: 'article:published_time',
        content: post.publishedAt,
      },
      {
        name: 'keywords',
        content: [
          'blog',
          'gastronomía',
          'restaurantes',
          'locales',
          ...(post.tags || []),
        ].join(', '),
      },
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
 * Generate default SEO configuration
 */
export function generateDefaultSEO(): NextSeoProps {
  return {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    canonical: SITE_CONFIG.url,
    openGraph: {
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      url: SITE_CONFIG.url,
      type: 'website',
      site_name: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      images: [
        {
          url: `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`,
          alt: SITE_CONFIG.name,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: [`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`],
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: [
          'restaurantes',
          'reseñas',
          'gastronomía',
          'locales',
          'opiniones',
          'blog',
          'comida',
          'España',
        ].join(', '),
      },
      {
        name: 'author',
        content: SITE_CONFIG.author,
      },
    ],
  };
}
