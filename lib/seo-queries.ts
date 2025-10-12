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
    seoKeywords
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
  *[_type == "offer" && published == true && validUntil >= now()] | order(publishedAt desc) {
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
