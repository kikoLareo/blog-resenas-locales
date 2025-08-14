import { groq } from 'next-sanity';

// Fragmentos reutilizables
const imageFragment = groq`
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

const cityFragment = groq`
  _id,
  title,
  "slug": slug.current,
  region
`;

const categoryFragment = groq`
  _id,
  title,
  "slug": slug.current,
  icon,
  color
`;

// Fragmentos base de consulta para reutilización
export const venueFields = groq`
  _id,
  title,
  "slug": slug.current,
  description,
  address,
  postalCode,
  phone,
  website,
  geo,
  openingHours,
  priceRange,
  schemaType,
  description,
  social,
  city->{${cityFragment}},
  categories[]->{${categoryFragment}},
  images[]{${imageFragment}}
`;

// Query para obtener un venue completo por slug
export const venueBySlugQuery = groq`
  *[_type == "venue" && slug.current == $slug][0]{
    ${venueFields},
    "reviews": *[_type == "review" && references(^._id)] | order(publishedAt desc)[0...6]{
      _id,
      title,
      "slug": slug.current,
      visitDate,
      ratings,
      avgTicket,
      tldr,
      gallery[0]{${imageFragment}},
      publishedAt
    }
  }
`;

// Query para obtener una reseña completa por slug
export const reviewBySlugQuery = groq`
  *[_type == "review" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    visitDate,
    ratings,
    avgTicket,
    highlights,
    pros,
    cons,
    tldr,
    faq,
    body,
    gallery[]{${imageFragment}},
    author,
    authorAvatar{${imageFragment}},
    tags,
    publishedAt,
    venue->{${venueFields}}
  }
`;

// Query para obtener un post por slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    cover{${imageFragment}},
    faq,
    body,
    tags,
    category->{${categoryFragment}},
    relatedVenues[]->{
      _id,
      title,
      "slug": slug.current,
      city->{${cityFragment}},
      images[0]{${imageFragment}}
    },
    author,
    authorAvatar{${imageFragment}},
    featured,
    publishedAt,
    seoTitle,
    seoDescription
  }
`;

// Query para últimas reseñas (homepage)
export const latestReviewsQuery = groq`
  *[_type == "review"] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    "slug": slug.current,
    visitDate,
    ratings,
    avgTicket,
    tldr,
    gallery[0]{${imageFragment}},
    publishedAt,
    venue->{
      _id,
      title,
      "slug": slug.current,
      city->{${cityFragment}},
      priceRange
    }
  }
`;

// Query para posts por tag
export const postsByTagQuery = groq`
  *[_type == "post" && $tag in tags] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    cover{${imageFragment}},
    publishedAt,
    category->{${categoryFragment}}
  }
`;

// Query para ciudades con conteos
export const citiesWithCountsQuery = groq`
  *[_type == "city"] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    region,
    heroImage{${imageFragment}},
    featured,
    "venueCount": count(*[_type == "venue" && references(^._id)]),
    "reviewCount": count(*[_type == "review" && venue._ref in *[_type == "venue" && references(^._id)]._id])
  }
`;

// Query para categorías con conteos
export const categoriesWithCountsQuery = groq`
  *[_type == "category"] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    icon,
    color,
    featured,
    "venueCount": count(*[_type == "venue" && references(^._id)])
  }
`;

// Query para venues por ciudad
export const venuesByCityQuery = groq`
  *[_type == "venue" && city._ref == $cityId] | order(title asc)[0...$limit]{
    ${venueBasicFragment},
    "avgRating": avg(*[_type == "review" && references(^._id)].ratings.food),
    "reviewCount": count(*[_type == "review" && references(^._id)])
  }
`;

// Query para venues por categoría
export const venuesByCategoryQuery = groq`
  *[_type == "venue" && $categoryId in categories[]._ref] | order(title asc)[0...$limit]{
    ${venueBasicFragment},
    "avgRating": avg(*[_type == "review" && references(^._id)].ratings.food),
    "reviewCount": count(*[_type == "review" && references(^._id)])
  }
`;

// Query para reseñas destacadas
export const featuredReviewsQuery = groq`
  *[_type == "review" && featured == true] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    "slug": slug.current,
    visitDate,
    ratings,
    tldr,
    gallery[0]{${imageFragment}},
    venue->{
      _id,
      title,
      "slug": slug.current,
      city->{${cityFragment}}
    }
  }
`;

export const getCategoryBySlug = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    color,
    "venues": *[_type == "venue" && references(^._id)] | order(publishedAt desc) {
      ${venueFields}
    }
  }
`;
    }
  }
`;

// Query para sitemap - venues
export const sitemapVenuesQuery = groq`
  *[_type == "venue"]{
    "slug": slug.current,
    city->{
      "slug": slug.current
    },
    _updatedAt
  }
`;

// Query para sitemap - reviews
export const sitemapReviewsQuery = groq`
  *[_type == "review"]{
    "slug": slug.current,
    venue->{
      "slug": slug.current,
      city->{
        "slug": slug.current
      }
    },
    visitDate,
    _updatedAt
  }
`;

// Query para sitemap - posts
export const sitemapPostsQuery = groq`
  *[_type == "post"]{
    "slug": slug.current,
    _updatedAt
  }
`;

export const getAllCities = groq`
  *[_type == "city"] | order(title asc) {
    _id,
    title,
    slug,
    region,
    description,
    "venueCount": count(*[_type == "venue" && city._ref == ^._id])
  }
`;

export const getCityBySlug = groq`
  *[_type == "city" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    region,
    description,
    "venues": *[_type == "venue" && city._ref == ^._id] | order(publishedAt desc) {
      ${venueFields}
    }
  }
`;

// Search queries
export const searchVenues = groq`
  *[_type == "venue" && (
    title match $searchTerm + "*" ||
    description match $searchTerm + "*" ||
    address match $searchTerm + "*"
  )] | order(_score desc) {
    ${venueFields},
    _score
  }
`;

export const searchReviews = groq`
  *[_type == "review" && (
    title match $searchTerm + "*" ||
    tldr match $searchTerm + "*" ||
    author match $searchTerm + "*"
  )] | order(_score desc) {
    ${reviewFields},
    _score
  }
`;

export const searchPosts = groq`
  *[_type == "post" && (
    title match $searchTerm + "*" ||
    excerpt match $searchTerm + "*" ||
    $searchTerm in tags
  )] | order(_score desc) {
    ${postFields},
    _score
  }
`;

// Advanced queries
export const getFeaturedVenues = groq`
  *[_type == "venue" && featured == true] | order(publishedAt desc) [0...6] {
    ${venueFields}
  }
`;

export const getTopRatedVenues = groq`
  *[_type == "venue"] {
    ${venueFields},
    "averageRating": math::avg(*[_type == "review" && venue._ref == ^._id].ratings[].food),
    "reviewCount": count(*[_type == "review" && venue._ref == ^._id])
  } | order(averageRating desc) [0...10]
`;

export const getRecentReviews = groq`
  *[_type == "review"] | order(publishedAt desc) [0...$limit] {
    ${reviewFields}
  }
`;

export const getRelatedVenues = groq`
  *[_type == "venue" && 
    _id != $venueId && 
    (city._ref == $cityRef || count(categories[]._ref[@ in $categoryRefs]) > 0)
  ] | order(publishedAt desc) [0...4] {
    ${venueFields}
  }
`;

// Sitemap and feed queries
export const getAllSlugs = groq`
  {
    "venues": *[_type == "venue" && defined(slug.current)].slug.current,
    "reviews": *[_type == "review" && defined(slug.current)].slug.current,
    "posts": *[_type == "post" && defined(slug.current)].slug.current,
    "categories": *[_type == "category" && defined(slug.current)].slug.current,
    "cities": *[_type == "city" && defined(slug.current)].slug.current
  }
`;

export const getLastModified = groq`
  {
    "venues": *[_type == "venue"] | order(_updatedAt desc)[0]._updatedAt,
    "reviews": *[_type == "review"] | order(_updatedAt desc)[0]._updatedAt,
    "posts": *[_type == "post"] | order(_updatedAt desc)[0]._updatedAt
  }
`;

// Stats queries
export const getStats = groq`
  {
    "totalVenues": count(*[_type == "venue"]),
    "totalReviews": count(*[_type == "review"]),
    "totalPosts": count(*[_type == "post"]),
    "totalCategories": count(*[_type == "category"]),
    "totalCities": count(*[_type == "city"])
  }
`;

export const getCityStats = groq`
  *[_type == "city"] {
    title,
    slug,
    "venueCount": count(*[_type == "venue" && city._ref == ^._id]),
    "reviewCount": count(*[_type == "review" && venue->city._ref == ^._id])
  } | order(venueCount desc)
`;

// Validation queries
export const validateVenueData = groq`
  *[_type == "venue" && (
    !defined(title) ||
    !defined(slug) ||
    !defined(description) ||
    !defined(address) ||
    !defined(city)
  )] {
    _id,
    title,
    slug,
    "missingFields": [
      !defined(title) => "title",
      !defined(slug) => "slug", 
      !defined(description) => "description",
      !defined(address) => "address",
      !defined(city) => "city"
    ][defined(@)]
  }
`;

export const validateReviewData = groq`
  *[_type == "review" && (
    !defined(title) ||
    !defined(slug) ||
    !defined(author) ||
    !defined(venue) ||
    !defined(ratings)
  )] {
    _id,
    title,
    slug,
    "missingFields": [
      !defined(title) => "title",
      !defined(slug) => "slug",
      !defined(author) => "author", 
      !defined(venue) => "venue",
      !defined(ratings) => "ratings"
    ][defined(@)]
  }
`;
  }
`;