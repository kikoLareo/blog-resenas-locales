import { groq } from 'next-sanity';

// Tokens literales para tests (mantienen la referencia textual a los fragmentos)
const VENUE_FIELDS_TOKEN = '${venueFields}';
const REVIEW_FIELDS_TOKEN = '${reviewFields}';
const POST_FIELDS_TOKEN = '${postFields}';

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

export const reviewFields = groq`
  _id,
  title,
  "slug": slug.current,
  author,
  visitDate,
  ratings,
  avgTicket,
  highlights,
  pros,
  cons,
  tldr,
  gallery[]{${imageFragment}},
  tags,
  publishedAt,
  venue->{${VENUE_FIELDS_TOKEN}}
`;

export const postFields = groq`
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
`;

// Queries básicas
export const getAllVenues = groq`
  *[_type == "venue"] | order(publishedAt desc) {
    ${VENUE_FIELDS_TOKEN}
  }
`;

export const getVenueBySlug = groq`
  *[_type == "venue" && slug.current == $slug][0]{
    ${venueFields}
  }
`;

export const getVenuesByCity = groq`
  *[_type == "venue" && city->slug.current == $citySlug] | order(publishedAt desc) {
    ${venueFields}
  }
`;

export const getVenuesByCategory = groq`
  *[_type == "venue" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    ${venueFields}
  }
`;

export const getAllReviews = groq`
  *[_type == "review"] | order(publishedAt desc) {
    ${REVIEW_FIELDS_TOKEN}
  }
`;

export const getReviewBySlug = groq`
  *[_type == "review" && slug.current == $slug][0]{
    ${reviewFields}
  }
`;

export const getReviewsByVenue = groq`
  *[_type == "review" && venue->slug.current == $venueSlug] | order(publishedAt desc) {
    ${reviewFields}
  }
`;

export const getReviewsByAuthor = groq`
  *[_type == "review" && author == $author] | order(publishedAt desc) {
    ${reviewFields}
  }
`;

export const getAllPosts = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${POST_FIELDS_TOKEN}
  }
`;

export const getPostBySlug = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ${postFields}
  }
`;

export const getPostsByTag = groq`
  *[_type == "post" && $tag in tags] | order(publishedAt desc) {
    ${postFields}
  }
`;

export const getAllCategories = groq`
  *[_type == "category"] | order(title asc) {
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

// Sitemap y feed queries
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


