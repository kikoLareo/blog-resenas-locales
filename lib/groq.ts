import { groq } from 'next-sanity';

// Fragmentos reutilizables
export const IMAGE_FRAGMENT = groq`
  asset->{
    _id,
    url,
    metadata {
      dimensions,
      lqip
    }
  },
  alt,
  caption
`;

export const VENUE_FRAGMENT = groq`
  _id,
  title,
  slug,
  city->{
    title,
    slug,
    region
  },
  address,
  postalCode,
  geo,
  phone,
  website,
  openingHours,
  priceRange,
  categories[]->{
    title,
    slug
  },
  schemaType,
  description,
  social,
  images[]{
    ${IMAGE_FRAGMENT}
  }
`;

export const REVIEW_FRAGMENT = groq`
  _id,
  title,
  slug,
  visitDate,
  publishedAt,
  ratings,
  avgTicket,
  highlights,
  pros,
  cons,
  tldr,
  author,
  authorAvatar{
    ${IMAGE_FRAGMENT}
  },
  tags,
  gallery[]{
    ${IMAGE_FRAGMENT}
  }
`;

// Query para obtener un venue por slug con sus reseñas
export const VENUE_BY_SLUG_QUERY = groq`
  *[_type == "venue" && slug.current == $slug][0]{
    ${VENUE_FRAGMENT},
    "reviews": *[_type == "review" && references(^._id)] | order(publishedAt desc)[0...5]{
      ${REVIEW_FRAGMENT}
    },
    "reviewCount": count(*[_type == "review" && references(^._id)]),
    "avgRating": math::avg(*[_type == "review" && references(^._id)].ratings.food)
  }
`;

// Query para obtener una reseña por slug con venue relacionado
export const REVIEW_BY_SLUG_QUERY = groq`
  *[_type == "review" && slug.current == $slug][0]{
    ${REVIEW_FRAGMENT},
    venue->{
      ${VENUE_FRAGMENT}
    },
    body[]{
      ...,
      _type == "image" => {
        ${IMAGE_FRAGMENT}
      }
    },
    faq
  }
`;

// Query para obtener las últimas reseñas para homepage
export const LATEST_REVIEWS_QUERY = groq`
  *[_type == "review"] | order(publishedAt desc)[0...$limit]{
    ${REVIEW_FRAGMENT},
    venue->{
      title,
      slug,
      city->{
        title,
        slug
      },
      priceRange,
      categories[0]->{
        title
      }
    }
  }
`;

// Query para obtener reseñas por tag
export const REVIEWS_BY_TAG_QUERY = groq`
  *[_type == "review" && $tag in tags] | order(publishedAt desc)[0...$limit]{
    ${REVIEW_FRAGMENT},
    venue->{
      title,
      slug,
      city->{
        title,
        slug
      }
    }
  }
`;

// Query para obtener reseñas por ciudad
export const REVIEWS_BY_CITY_QUERY = groq`
  *[_type == "review" && venue->city->slug.current == $citySlug] | order(publishedAt desc)[0...$limit]{
    ${REVIEW_FRAGMENT},
    venue->{
      title,
      slug,
      priceRange,
      categories[0]->{
        title
      }
    }
  }
`;

// Query para obtener ciudades con conteos
export const CITIES_WITH_COUNTS_QUERY = groq`
  *[_type == "city"] | order(title asc){
    _id,
    title,
    slug,
    region,
    description,
    heroImage{
      ${IMAGE_FRAGMENT}
    },
    "venueCount": count(*[_type == "venue" && references(^._id)]),
    "reviewCount": count(*[_type == "review" && venue->city._ref == ^._id])
  }
`;

// Query para obtener venues por ciudad
export const VENUES_BY_CITY_QUERY = groq`
  *[_type == "venue" && city->slug.current == $citySlug] | order(title asc)[0...$limit]{
    ${VENUE_FRAGMENT},
    "reviewCount": count(*[_type == "review" && references(^._id)]),
    "avgRating": math::avg(*[_type == "review" && references(^._id)].ratings.food),
    "latestReview": *[_type == "review" && references(^._id)] | order(publishedAt desc)[0]{
      publishedAt,
      ratings
    }
  }
`;

// Query para obtener categorías con conteos
export const CATEGORIES_WITH_COUNTS_QUERY = groq`
  *[_type == "category"] | order(title asc){
    _id,
    title,
    slug,
    description,
    "venueCount": count(*[_type == "venue" && references(^._id)]),
    "reviewCount": count(*[_type == "review" && venue->categories[]._ref match ^._id])
  }
`;

// Query para obtener venues por categoría
export const VENUES_BY_CATEGORY_QUERY = groq`
  *[_type == "venue" && $categoryId in categories[]._ref] | order(title asc)[0...$limit]{
    ${VENUE_FRAGMENT},
    "reviewCount": count(*[_type == "review" && references(^._id)]),
    "avgRating": math::avg(*[_type == "review" && references(^._id)].ratings.food)
  }
`;

// Query para sitemap - todas las URLs
export const SITEMAP_URLS_QUERY = groq`{
  "venues": *[_type == "venue" && defined(slug.current)]{
    "slug": slug.current,
    "_updatedAt": _updatedAt
  },
  "reviews": *[_type == "review" && defined(slug.current)]{
    "slug": slug.current,
    "_updatedAt": _updatedAt,
    "publishedAt": publishedAt
  },
  "cities": *[_type == "city" && defined(slug.current)]{
    "slug": slug.current,
    "_updatedAt": _updatedAt
  },
  "categories": *[_type == "category" && defined(slug.current)]{
    "slug": slug.current,
    "_updatedAt": _updatedAt
  }
}`;

// Query para obtener reseñas relacionadas
export const RELATED_REVIEWS_QUERY = groq`
  *[_type == "review" && 
    _id != $currentId && 
    (venue->city._ref == $cityRef || 
     count(tags[@ in $tags]) > 0 ||
     venue->categories[]._ref in $categoryRefs)
  ] | order(publishedAt desc)[0...$limit]{
    ${REVIEW_FRAGMENT},
    venue->{
      title,
      slug,
      city->{
        title,
        slug
      },
      priceRange
    }
  }
`;

// Query para obtener estadísticas generales
export const SITE_STATS_QUERY = groq`{
  "totalReviews": count(*[_type == "review"]),
  "totalVenues": count(*[_type == "venue"]),
  "totalCities": count(*[_type == "city"]),
  "avgRating": math::avg(*[_type == "review"].ratings.food),
  "latestReview": *[_type == "review"] | order(publishedAt desc)[0]{
    title,
    slug,
    publishedAt,
    venue->{
      title,
      slug
    }
  }
}`;

// Query para búsqueda global
export const SEARCH_QUERY = groq`
  {
    "venues": *[_type == "venue" && (title match $searchTerm || description match $searchTerm)][0...10]{
      ${VENUE_FRAGMENT}
    },
    "reviews": *[_type == "review" && (title match $searchTerm || tldr match $searchTerm)][0...10]{
      ${REVIEW_FRAGMENT},
      venue->{
        title,
        slug
      }
    }
  }
`;

// Query para obtener tags populares
export const POPULAR_TAGS_QUERY = groq`
  *[_type == "review" && defined(tags)] {
    tags
  } | {
    "tag": tags[],
  } | group(tag) | {
    "tag": _key,
    "count": count(_group)
  } | order(count desc)[0...20]
`;