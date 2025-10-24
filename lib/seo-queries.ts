import { groq } from 'next-sanity';

// Query para obtener todas las guías
export const getGuidesQuery = groq`
  *[_type == "guide" && published == true] | order(publishedAt desc) {
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
    published,
    featured,
    publishedAt,
    lastUpdated,
    stats,
    seoTitle,
    seoDescription,
    seoKeywords,
    "venueCount": count(sections[].venues[].venue)
  }
`;

// Query para obtener todas las listas
export const getListsQuery = groq`
  *[_type == "list" && published == true] | order(publishedAt desc) {
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
    published,
    featured,
    publishedAt,
    lastUpdated,
    criteria,
    stats,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`;

// Query para obtener todas las recetas
export const getRecipesQuery = groq`
  *[_type == "recipe" && published == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    recipeType,
    difficulty,
    prepTime,
    cookTime,
    servings,
    ingredients,
    instructions,
    tips,
    nutrition,
    published,
    featured,
    publishedAt,
    lastUpdated,
    stats,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`;

// Query para obtener todas las guías de platos
export const getDishGuidesQuery = groq`
  *[_type == "dish-guide" && published == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    dish,
    origin,
    history,
    ingredients,
    variations,
    bestPlaces,
    tips,
    published,
    featured,
    publishedAt,
    lastUpdated,
    stats,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`;

// Query para obtener todas las noticias
export const getNewsQuery = groq`
  *[_type == "news" && published == true && expiryDate >= now()] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    city->{
      title,
      slug
    },
    published,
    featured,
    publishedAt,
    expiryDate,
    content,
    tags,
    stats,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`;

// Query para obtener todas las ofertas
export const getOffersQuery = groq`
  *[_type == "offer" && published == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    venue->{
      title,
      slug
    },
    offerType,
    discount,
    originalPrice,
    offerPrice,
    validFrom,
    validUntil,
    conditions,
    published,
    featured,
    publishedAt,
    stats,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`;

// Query para obtener estadísticas de contenidos SEO
export const getSEOContentStatsQuery = groq`
{
  "guides": {
    "total": count(*[_type == "guide"]),
    "published": count(*[_type == "guide" && published == true]),
    "drafts": count(*[_type == "guide" && published != true]),
    "featured": count(*[_type == "guide" && featured == true]),
    "thisMonth": count(*[_type == "guide" && publishedAt > dateTime(now()) - 60*60*24*30]),
    "avgViews": math::avg(*[_type == "guide" && defined(stats.views)].stats.views)
  },
  "lists": {
    "total": count(*[_type == "list"]),
    "published": count(*[_type == "list" && published == true]),
    "drafts": count(*[_type == "list" && published != true]),
    "featured": count(*[_type == "list" && featured == true]),
    "thisMonth": count(*[_type == "list" && publishedAt > dateTime(now()) - 60*60*24*30]),
    "avgViews": math::avg(*[_type == "list" && defined(stats.views)].stats.views)
  },
  "recipes": {
    "total": count(*[_type == "recipe"]),
    "published": count(*[_type == "recipe" && published == true]),
    "drafts": count(*[_type == "recipe" && published != true]),
    "featured": count(*[_type == "recipe" && featured == true]),
    "thisMonth": count(*[_type == "recipe" && publishedAt > dateTime(now()) - 60*60*24*30]),
    "avgCookTime": math::avg(*[_type == "recipe" && defined(cookTime)].cookTime)
  },
  "dishGuides": {
    "total": count(*[_type == "dish-guide"]),
    "published": count(*[_type == "dish-guide" && published == true]),
    "drafts": count(*[_type == "dish-guide" && published != true]),
    "featured": count(*[_type == "dish-guide" && featured == true]),
    "thisMonth": count(*[_type == "dish-guide" && publishedAt > dateTime(now()) - 60*60*24*30])
  },
  "news": {
    "total": count(*[_type == "news"]),
    "published": count(*[_type == "news" && published == true]),
    "drafts": count(*[_type == "news" && published != true]),
    "featured": count(*[_type == "news" && featured == true]),
    "expiringSoon": count(*[_type == "news" && expiryDate > now() && expiryDate < dateTime(now()) + 60*60*24*7]),
    "thisMonth": count(*[_type == "news" && publishedAt > dateTime(now()) - 60*60*24*30])
  },
  "offers": {
    "total": count(*[_type == "offer"]),
    "published": count(*[_type == "offer" && published == true]),
    "drafts": count(*[_type == "offer" && published != true]),
    "featured": count(*[_type == "offer" && featured == true]),
    "expiringSoon": count(*[_type == "offer" && validUntil > now() && validUntil < dateTime(now()) + 60*60*24*7]),
    "active": count(*[_type == "offer" && validUntil > now()]),
    "thisMonth": count(*[_type == "offer" && publishedAt > dateTime(now()) - 60*60*24*30])
  }
}`;

// Query para obtener actividad reciente de contenidos SEO
export const getRecentSEOActivityQuery = groq`
{
  "recent": [
    ...*[_type in ["guide", "list", "recipe", "dish-guide", "news", "offer"] && published == true] | order(publishedAt desc)[0...10] {
      _id,
      _type,
      title,
      publishedAt,
      "action": "published"
    },
    ...*[_type in ["guide", "list", "recipe", "dish-guide", "news", "offer"] && lastUpdated > publishedAt] | order(lastUpdated desc)[0...10] {
      _id,
      _type,
      title,
      lastUpdated,
      "action": "updated"
    }
  ] | order(coalesce(publishedAt, lastUpdated) desc)[0...8]
}`;

// Query para obtener contenido programado y calendario editorial
export const getEditorialCalendarQuery = groq`
{
  "scheduled": *[_type in ["guide", "list", "recipe", "dish-guide", "news", "offer"] && published != true] | order(_createdAt desc)[0...5] {
    _id,
    _type,
    title,
    _createdAt,
    published
  },
  "expiring": [
    ...*[_type == "news" && defined(expiryDate) && expiryDate > now()] | order(expiryDate asc)[0...3] {
      _id,
      _type,
      title,
      expiryDate,
      "eventType": "expires"
    },
    ...*[_type == "offer" && defined(validUntil) && validUntil > now()] | order(validUntil asc)[0...3] {
      _id,
      _type,
      title,
      validUntil,
      "eventType": "expires"
    }
  ] | order(coalesce(expiryDate, validUntil) asc)[0...5]
}`;

// Query para obtener contenido SEO destacado
export const getFeaturedSEOContentQuery = groq`
  {
    "guides": *[_type == "guide" && published == true && featured == true] | order(publishedAt desc)[0...3] {
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
      publishedAt,
      stats
    },
    "lists": *[_type == "list" && published == true && featured == true] | order(publishedAt desc)[0...3] {
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
      publishedAt,
      stats
    },
    "recipes": *[_type == "recipe" && published == true && featured == true] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      description,
      recipeType,
      difficulty,
      prepTime,
      cookTime,
      servings,
      publishedAt,
      stats
    },
    "news": *[_type == "news" && published == true && featured == true && expiryDate >= now()] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      category,
      city->{
        title,
        slug
      },
      publishedAt,
      stats
    },
    "offers": *[_type == "offer" && published == true && featured == true && validUntil >= now()] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      venue->{
        title,
        slug,
        city->{
          title,
          slug
        }
      },
      offerType,
      discount,
      originalPrice,
      offerPrice,
      validUntil,
      publishedAt,
      stats
    }
  }
`;

// Query para obtener una guía específica
export const getGuideBySlugQuery = groq`
  *[_type == "guide" && slug.current == $slug && published == true][0] {
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
    published,
    featured,
    publishedAt,
    lastUpdated,
    sections,
    stats,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`;

// Query para obtener una lista específica
export const getListBySlugQuery = groq`
  *[_type == "list" && slug.current == $slug && published == true][0] {
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
    published,
    featured,
    publishedAt,
    lastUpdated,
    venues[]->{
      _id,
      title,
      slug,
      address,
      priceRange,
      city->{
        title,
        slug
      }
    },
    criteria,
    stats,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`;

// Query para obtener una receta específica
export const getRecipeBySlugQuery = groq`
  *[_type == "recipe" && slug.current == $slug && published == true][0] {
    _id,
    title,
    slug,
    description,
    recipeType,
    difficulty,
    prepTime,
    cookTime,
    servings,
    ingredients,
    instructions,
    tips,
    nutrition,
    published,
    featured,
    publishedAt,
    lastUpdated,
    stats,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`;
