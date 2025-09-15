/**
 * Schemas JSON-LD específicos para la nueva arquitectura de contenidos SEO
 */

import { SITE_CONFIG } from './constants';

// Base schema interfaces
interface BaseSchema {
  '@context': 'https://schema.org';
  '@type': string;
}

interface ImageObject {
  '@type': 'ImageObject';
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface LocalBusiness {
  '@type': 'LocalBusiness' | 'Restaurant' | 'CafeOrCoffeeShop' | 'BarOrPub';
  name: string;
  url?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  priceRange?: string;
  image?: ImageObject[];
}

// Guide Schema (BreadcrumbList + ItemList + LocalBusiness + FAQPage)
export function generateGuideSchema(guide: {
  title: string;
  description: string;
  url: string;
  image: string;
  city: string;
  sections: Array<{
    sectionTitle: string;
    venues: Array<{
      venue: {
        title: string;
        address: string;
        priceRange: string;
        geo?: { lat: number; lng: number };
      };
      position?: number;
    }>;
  }>;
  faq?: Array<{ question: string; answer: string }>;
  publishedAt: string;
  lastUpdated: string;
}) {
  const schemas: BaseSchema[] = [];

  // Main Article Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    url: guide.url,
    image: {
      '@type': 'ImageObject',
      url: guide.image,
    },
    datePublished: guide.publishedAt,
    dateModified: guide.lastUpdated,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
  });

  // ItemList Schema for venues
  const allVenues = guide.sections.flatMap(section => section.venues);
  if (allVenues.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: guide.title,
      description: guide.description,
      numberOfItems: allVenues.length,
      itemListElement: allVenues.map((venueItem, index) => ({
        '@type': 'ListItem',
        position: venueItem.position || index + 1,
        item: {
          '@type': 'LocalBusiness',
          name: venueItem.venue.title,
          address: {
            '@type': 'PostalAddress',
            streetAddress: venueItem.venue.address,
            addressLocality: guide.city,
            addressCountry: 'ES',
          },
          priceRange: venueItem.venue.priceRange,
          ...(venueItem.venue.geo && {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: venueItem.venue.geo.lat,
              longitude: venueItem.venue.geo.lng,
            },
          }),
        },
      })),
    });
  }

  // FAQ Schema
  if (guide.faq && guide.faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faq.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return schemas;
}

// List/Ranking Schema (ItemList + Review + LocalBusiness)
export function generateListSchema(list: {
  title: string;
  description: string;
  url: string;
  image: string;
  city: string;
  dish?: string;
  rankedVenues: Array<{
    position: number;
    venue: {
      title: string;
      address: string;
      priceRange: string;
    };
    score?: number;
    highlight?: string;
  }>;
  faq?: Array<{ question: string; answer: string }>;
  publishedAt: string;
  lastUpdated: string;
}) {
  const schemas: BaseSchema[] = [];

  // Main Article Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: list.title,
    description: list.description,
    url: list.url,
    image: {
      '@type': 'ImageObject',
      url: list.image,
    },
    datePublished: list.publishedAt,
    dateModified: list.lastUpdated,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
  });

  // ItemList Schema for ranking
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: list.title,
    description: list.description,
    numberOfItems: list.rankedVenues.length,
    itemListElement: list.rankedVenues.map(venueItem => ({
      '@type': 'ListItem',
      position: venueItem.position,
      item: {
        '@type': 'LocalBusiness',
        name: venueItem.venue.title,
        address: {
          '@type': 'PostalAddress',
          streetAddress: venueItem.venue.address,
          addressLocality: list.city,
          addressCountry: 'ES',
        },
        priceRange: venueItem.venue.priceRange,
        ...(venueItem.score && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: venueItem.score,
            bestRating: 10,
            worstRating: 0,
          },
        }),
      },
    })),
  });

  // FAQ Schema
  if (list.faq && list.faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: list.faq.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return schemas;
}

// Recipe Schema (Recipe + HowTo + VideoObject + ImageObject)
export function generateRecipeSchema(recipe: {
  title: string;
  description: string;
  url: string;
  image: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  ingredients: Array<{
    amount: string;
    unit?: string;
    ingredient: string;
  }>;
  instructions: Array<{
    step: number;
    instruction: string;
  }>;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  publishedAt: string;
}) {
  const schemas: BaseSchema[] = [];

  // Recipe Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: {
      '@type': 'ImageObject',
      url: recipe.image,
    },
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    datePublished: recipe.publishedAt,
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.totalTime}M`,
    recipeYield: recipe.servings,
    recipeIngredient: recipe.ingredients.map(ing => 
      `${ing.amount} ${ing.unit || ''} ${ing.ingredient}`.trim()
    ),
    recipeInstructions: recipe.instructions.map(inst => ({
      '@type': 'HowToStep',
      text: inst.instruction,
    })),
    ...(recipe.nutritionalInfo && {
      nutrition: {
        '@type': 'NutritionInformation',
        ...(recipe.nutritionalInfo.calories && { calories: `${recipe.nutritionalInfo.calories} calories` }),
        ...(recipe.nutritionalInfo.protein && { proteinContent: `${recipe.nutritionalInfo.protein}g` }),
        ...(recipe.nutritionalInfo.carbs && { carbohydrateContent: `${recipe.nutritionalInfo.carbs}g` }),
        ...(recipe.nutritionalInfo.fat && { fatContent: `${recipe.nutritionalInfo.fat}g` }),
      },
    }),
  });

  // HowTo Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Cómo hacer ${recipe.title}`,
    description: recipe.description,
    image: {
      '@type': 'ImageObject',
      url: recipe.image,
    },
    totalTime: `PT${recipe.totalTime}M`,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: '10-20',
    },
    supply: recipe.ingredients.map(ing => ({
      '@type': 'HowToSupply',
      name: ing.ingredient,
    })),
    step: recipe.instructions.map(inst => ({
      '@type': 'HowToStep',
      text: inst.instruction,
    })),
  });

  return schemas;
}

// Dish Guide Schema (Article + FAQPage + HowTo)
export function generateDishGuideSchema(dishGuide: {
  title: string;
  description: string;
  url: string;
  image: string;
  dishName: string;
  ingredients: string[];
  bestVenues: Array<{
    venue: {
      title: string;
      address: string;
      priceRange: string;
    };
    position: number;
  }>;
  faq?: Array<{ question: string; answer: string }>;
  publishedAt: string;
}) {
  const schemas: BaseSchema[] = [];

  // Main Article Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: dishGuide.title,
    description: dishGuide.description,
    url: dishGuide.url,
    image: {
      '@type': 'ImageObject',
      url: dishGuide.image,
    },
    datePublished: dishGuide.publishedAt,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
  });

  // HowTo Schema for "How to eat/order"
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Cómo comer ${dishGuide.dishName}`,
    description: `Guía completa sobre ${dishGuide.dishName}`,
    image: {
      '@type': 'ImageObject',
      url: dishGuide.image,
    },
  });

  // FAQ Schema
  if (dishGuide.faq && dishGuide.faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: dishGuide.faq.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return schemas;
}

// News Schema (NewsArticle + Event)
export function generateNewsSchema(news: {
  title: string;
  description: string;
  url: string;
  image: string;
  newsType: string;
  city: string;
  venues?: Array<{ venue: { title: string } }>;
  eventDate?: string;
  publishedAt: string;
}) {
  const schemas: BaseSchema[] = [];

  // NewsArticle Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.description,
    url: news.url,
    image: {
      '@type': 'ImageObject',
      url: news.image,
    },
    datePublished: news.publishedAt,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
  });

  // Event Schema if it's an event
  if (news.newsType === 'eventos' && news.eventDate) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: news.title,
      description: news.description,
      startDate: news.eventDate,
      location: {
        '@type': 'Place',
        name: news.city,
        address: {
          '@type': 'PostalAddress',
          addressLocality: news.city,
          addressCountry: 'ES',
        },
      },
      image: {
        '@type': 'ImageObject',
        url: news.image,
      },
    });
  }

  return schemas;
}

// Offer Schema (Offer + Menu + LocalBusiness)
export function generateOfferSchema(offer: {
  title: string;
  description: string;
  url: string;
  image: string;
  offerType: string;
  priceRange: { min: number; max: number; currency: string };
  validFrom: string;
  validUntil: string;
  venuesWithOffers: Array<{
    venue: {
      title: string;
      address: string;
    };
    offerTitle: string;
    price: number;
  }>;
  publishedAt: string;
}) {
  const schemas: BaseSchema[] = [];

  // Main Article Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: offer.title,
    description: offer.description,
    url: offer.url,
    image: {
      '@type': 'ImageObject',
      url: offer.image,
    },
    datePublished: offer.publishedAt,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
  });

  // Offer Schemas for each venue
  offer.venuesWithOffers.forEach(venueOffer => {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Offer',
      name: venueOffer.offerTitle,
      description: offer.description,
      price: venueOffer.price,
      priceCurrency: offer.priceRange.currency,
      validFrom: offer.validFrom,
      validThrough: offer.validUntil,
      offeredBy: {
        '@type': 'LocalBusiness',
        name: venueOffer.venue.title,
        address: {
          '@type': 'PostalAddress',
          streetAddress: venueOffer.venue.address,
          addressCountry: 'ES',
        },
      },
    });
  });

  return schemas;
}

// Utility function to inject schemas into page head
export function injectSchemas(schemas: BaseSchema[]) {
  if (typeof window !== 'undefined') {
    // Remove existing schema scripts
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => {
      if (script.getAttribute('data-auto-generated') === 'true') {
        script.remove();
      }
    });

    // Add new schemas
    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-auto-generated', 'true');
      script.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    });
  }
}

// React hook for schema injection
export function useSchemas(schemas: BaseSchema[]) {
  if (typeof window !== 'undefined') {
    // Use useEffect in the actual component
    injectSchemas(schemas);
  }
}
