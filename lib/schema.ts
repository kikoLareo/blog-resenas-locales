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
  City,
  Category,
} from './types';
import { SITE_CONFIG } from './constants';

/**
 * Generate LocalBusiness JSON-LD for venues with AEO optimizations
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
  } as LocalBusinessJsonLd;

  // Add AEO optimizations as additional properties
  (schema as any).knowsAbout = servesCuisine.concat(['gastronomía', 'restaurante', 'comida local']);
  (schema as any).keywords = [venue.title, venue.city.title, ...servesCuisine].join(', ');

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
 * Generate Review JSON-LD with AEO optimizations
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
  const reviewUrl = `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}/review/${review.slug.current}`;

  const reviewSchema = {
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
  } as ReviewJsonLd;
  
  // Add AEO optimizations as additional properties
  (reviewSchema as any).keywords = [venue.title, venue.city.title, 'reseña', 'opinión', 'experiencia'].join(', ');
  (reviewSchema as any).about = {
    '@type': 'Thing',
    name: `${venue.title} en ${venue.city.title}`,
    sameAs: `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}`,
  };
  (reviewSchema as any).speakable = {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.tldr-section', '.review-summary'],
  };
  
  return reviewSchema;
}

/**
 * Generate Article/BlogPosting JSON-LD for posts with AEO optimizations
 */
export function articleJsonLd(post: Post): ArticleJsonLd {
  const baseUrl = SITE_CONFIG.url;
  const url = `${baseUrl}/blog/${post.slug.current}`;

  const articleSchema = {
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
  } as ArticleJsonLd;
  
  // Add AEO optimizations as additional properties
  if (post.tags) {
    (articleSchema as any).about = post.tags.map(tag => ({
      '@type': 'Thing',
      name: tag,
    }));
    (articleSchema as any).mentions = post.tags.map(tag => ({
      '@type': 'Thing',
      name: tag,
    }));
  }
  
  // Voice search optimization
  (articleSchema as any).speakable = {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.tldr-section', '.article-summary', 'h1', 'h2'],
  };
  
  // AEO: Indicate this content answers questions
  (articleSchema as any).potentialAction = {
    '@type': 'ReadAction',
    target: url,
  };
  
  return articleSchema;
}

/**
 * Generate QAPage JSON-LD for voice search optimization
 */
export function qaPageJsonLd(
  mainQuestion: string,
  mainAnswer: string,
  relatedQuestions?: { question: string; answer: string }[],
  url?: string
) {
  const baseUrl = SITE_CONFIG.url;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: mainQuestion,
      text: mainQuestion,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: mainAnswer,
        // AEO: Mark as speakable for voice search
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.answer-text', '.qa-answer'],
        },
      },
    },
    // AEO: Related questions for "People also ask"
    ...(relatedQuestions && relatedQuestions.length > 0 && {
      mentions: relatedQuestions.map(qa => ({
        '@type': 'Question',
        name: qa.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: qa.answer,
        },
      })),
    }),
    ...(url && { url }),
  };

  return schema;
}

/**
 * Generate HowTo JSON-LD for step-by-step guides (restaurant visits, etc.)
 */
export function howToJsonLd(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>,
  totalTime?: string,
  url?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    ...(url && { url }),
    supply: [],
    tool: [],
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image,
        },
      }),
    })),
    // AEO: Voice search optimization
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.how-to-step', '.step-description'],
    },
  };
}

/**
 * Generate MenuSection JSON-LD for restaurant menus
 */
export function menuSectionJsonLd(
  venue: Venue,
  sections: Array<{
    name: string;
    description?: string;
    items: Array<{
      name: string;
      description?: string;
      price?: number;
      image?: string;
    }>;
  }>
) {
  const baseUrl = SITE_CONFIG.url;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `Carta de ${venue.title}`,
    description: `Menú completo de ${venue.title} en ${venue.city.title}`,
    provider: {
      '@type': venue.schemaType || 'LocalBusiness',
      name: venue.title,
      url: `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}`,
    },
    hasMenuSection: sections.map(section => ({
      '@type': 'MenuSection',
      name: section.name,
      ...(section.description && { description: section.description }),
      hasMenuItem: section.items.map(item => ({
        '@type': 'MenuItem',
        name: item.name,
        ...(item.description && { description: item.description }),
        ...(item.price && {
          offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: 'EUR',
          },
        }),
        ...(item.image && {
          image: {
            '@type': 'ImageObject',
            url: item.image,
          },
        }),
      })),
    })),
  };
}

/**
 * Generate Event JSON-LD for restaurant events and promotions
 */
export function eventJsonLd(
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  venue: Venue,
  offers?: { price?: number; availability?: string }
) {
  const baseUrl = SITE_CONFIG.url;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    location: {
      '@type': 'Place',
      name: venue.title,
      address: {
        '@type': 'PostalAddress',
        streetAddress: venue.address,
        addressLocality: venue.city.title,
        addressRegion: venue.city.region,
        addressCountry: 'ES',
      },
      ...(venue.geo && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: venue.geo.lat,
          longitude: venue.geo.lng,
        },
      }),
    },
    organizer: {
      '@type': 'Organization',
      name: venue.title,
      url: `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}`,
    },
    ...(offers && {
      offers: {
        '@type': 'Offer',
        ...(offers.price && { price: offers.price, priceCurrency: 'EUR' }),
        ...(offers.availability && { availability: `https://schema.org/${offers.availability}` }),
      },
    }),
    // AEO: Event information for voice search
    about: {
      '@type': 'Thing',
      name: `Evento en ${venue.title}`,
    },
  };
}

/**
 * Generate enhanced FAQ JSON-LD with voice search patterns
 */
export function faqJsonLd(faqs: FAQ[]): FAQJsonLd | null {
  if (!faqs || faqs.length === 0) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      text: faq.question,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        // AEO: Mark answers as speakable for voice assistants
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.faq-answer', '.answer-text'],
        },
      },
    })),
  } as FAQJsonLd;
  
  // Add AEO optimizations as additional properties
  (faqSchema as any).speakable = {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.faq-section', '.faq-question', '.faq-answer'],
  };
  (faqSchema as any).about = {
    '@type': 'Thing',
    name: 'Preguntas frecuentes',
  };
  
  return faqSchema;
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
  items: (Review | Venue | Post)[],
  listName: string,
  description?: string,
  listUrl?: string
) {
  const baseUrl = SITE_CONFIG.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description,
    url: listUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => {
      // Determinar el tipo de item y generar la URL correspondiente
      let url: string;
      let itemType: string;
      
      if ('venue' in item) {
        // Es una Review
        const review = item as Review;
        url = `${baseUrl}/${review.venue.city.slug.current}/${review.venue.slug.current}/review/${review.slug.current}`;
        itemType = 'Review';
      } else if ('city' in item) {
        // Es un Venue
        const venue = item as Venue;
        url = `${baseUrl}/${venue.city.slug.current}/${venue.slug.current}`;
        itemType = 'LocalBusiness';
      } else {
        // Es un Post
        const post = item as Post;
        url = `${baseUrl}/blog/${post.slug.current}`;
        itemType = 'BlogPosting';
      }

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': itemType,
          name: item.title,
          url,
          datePublished: 'publishedAt' in item ? item.publishedAt : undefined,
          author: 'author' in item ? {
            '@type': 'Person',
            name: item.author,
          } : undefined,
        },
      };
    }),
  };
}

/**
 * Generate CollectionPage JSON-LD for city/category pages
 */
export function collectionPageJsonLd(
  title: string,
  description: string,
  url: string,
  items: (Venue | Review)[] = []
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
      itemListElement: items.map((item, index) => {
        let url: string;
        let itemType: string;
        
        if ('venue' in item) {
          // Es una Review
          const review = item as Review;
          url = `${SITE_CONFIG.url}/${review.venue.city.slug.current}/${review.venue.slug.current}/review/${review.slug.current}`;
          itemType = 'Review';
        } else {
          // Es un Venue
          const venue = item as Venue;
          url = `${SITE_CONFIG.url}/${venue.city.slug.current}/${venue.slug.current}`;
          itemType = 'LocalBusiness';
        }

        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': itemType,
            name: item.title,
            url,
          },
        };
      }),
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
    { name: review.title, url: `/${venue.city.slug.current}/${venue.slug.current}/review/${review.slug.current}` },
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
      `Las mejores reseñas de ${venue.title} en ${venue.city.title}`,
      `${SITE_CONFIG.url}/${venue.city.slug.current}/${venue.slug.current}`
    ));
  }

  return combineJsonLd(...schemas);
}

/**
 * Generate complete page JSON-LD for city pages
 */
export function cityPageJsonLd(city: City, venues: Venue[] = []) {
  const baseUrl = SITE_CONFIG.url;
  const cityUrl = `${baseUrl}/${city.slug.current}`;
  
  const schemas: object[] = [
    collectionPageJsonLd(
      `Restaurantes y locales en ${city.title}`,
      `Descubre los mejores restaurantes y locales en ${city.title}. Reseñas, direcciones y recomendaciones.`,
      cityUrl,
      venues
    ),
  ];

  // Generar breadcrumbs
  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: city.title, url: `/${city.slug.current}` },
  ];
  schemas.push(breadcrumbsJsonLd(breadcrumbs));

  // Agregar lista de venues si existen
  if (venues.length > 0) {
    schemas.push(itemListJsonLd(
      venues,
      `Locales en ${city.title}`,
      `Los mejores restaurantes y locales en ${city.title}`,
      cityUrl
    ));
  }

  return combineJsonLd(...schemas);
}

/**
 * Generate complete page JSON-LD for category pages
 */
export function categoryPageJsonLd(category: Category, venues: Venue[] = []) {
  const baseUrl = SITE_CONFIG.url;
  const categoryUrl = `${baseUrl}/categorias/${category.slug.current}`;
  
  const schemas: object[] = [
    collectionPageJsonLd(
      `${category.title} - Restaurantes y locales`,
      category.description || `Descubre los mejores ${category.title.toLowerCase()} con nuestras reseñas detalladas.`,
      categoryUrl,
      venues
    ),
  ];

  // Generar breadcrumbs
  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: 'Categorías', url: '/categorias' },
    { name: category.title, url: `/categorias/${category.slug.current}` },
  ];
  schemas.push(breadcrumbsJsonLd(breadcrumbs));

  // Agregar lista de venues si existen
  if (venues.length > 0) {
    schemas.push(itemListJsonLd(
      venues,
      `${category.title}`,
      `Los mejores ${category.title.toLowerCase()} reseñados por nuestro equipo`,
      categoryUrl
    ));
  }

  return combineJsonLd(...schemas);
}

/**
 * Generate complete page JSON-LD for blog listing page
 */
export function blogPageJsonLd(posts: Post[] = []) {
  const baseUrl = SITE_CONFIG.url;
  const blogUrl = `${baseUrl}/blog`;
  
  const schemas: object[] = [
    collectionPageJsonLd(
      'Blog - Artículos sobre gastronomía',
      'Artículos, guías y consejos sobre restaurantes, cocina y gastronomía.',
      blogUrl
    ),
  ];

  // Generar breadcrumbs
  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: 'Blog', url: '/blog' },
  ];
  schemas.push(breadcrumbsJsonLd(breadcrumbs));

  // Agregar lista de posts si existen
  if (posts.length > 0) {
    schemas.push(itemListJsonLd(
      posts,
      'Artículos del blog',
      'Los últimos artículos sobre gastronomía y restaurantes',
      blogUrl
    ));
  }

  return combineJsonLd(...schemas);
}

/**
 * Generate complete page JSON-LD for blog post pages
 */
export function postPageJsonLd(post: Post) {
  const schemas: object[] = [
    articleJsonLd(post),
  ];

  // Agregar FAQ si existe
  if (post.faq && post.faq.length > 0) {
    const faqSchema = faqJsonLd(post.faq);
    if (faqSchema) {
      schemas.push(faqSchema);
    }
  }

  // Generar breadcrumbs
  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug.current}` },
  ];
  schemas.push(breadcrumbsJsonLd(breadcrumbs));

  return combineJsonLd(...schemas);
}

/**
 * Generate complete page JSON-LD for home page
 */
export function homePageJsonLd(featuredReviews: Review[] = [], featuredPosts: Post[] = []) {
  const schemas: object[] = [
    websiteJsonLd(),
    organizationJsonLd(),
  ];

  // Agregar lista de reseñas destacadas si existen
  if (featuredReviews.length > 0) {
    schemas.push(itemListJsonLd(
      featuredReviews,
      'Reseñas destacadas',
      'Las mejores reseñas de restaurantes y locales',
      SITE_CONFIG.url
    ));
  }

  // Agregar lista de posts destacados si existen
  if (featuredPosts.length > 0) {
    schemas.push(itemListJsonLd(
      featuredPosts,
      'Artículos destacados',
      'Los mejores artículos sobre gastronomía',
      `${SITE_CONFIG.url}/blog`
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

/**
 * Utility to render JSON-LD script tag
 */
export function renderJsonLd(schema: object | null) {
  if (!schema) return null;
  
  return JSON.stringify(schema, null, 0);
}
