import { groq } from 'next-sanity';

// Fragments reutilizables
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

const venueBasicFragment = groq`
  _id,
  title,
  "slug": slug.current,
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
    ${venueBasicFragment},
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
    venue->{${venueBasicFragment}}
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