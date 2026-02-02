import { groq } from 'next-sanity';

// Query para obtener venue con sus reseñas
export const venueWithReviewsQuery = groq`
  *[_type == "venue" && slug.current == $venueSlug && city->slug.current == $citySlug][0] {
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
    social,
    images[] {
      asset-> {
        _id,
        url
      },
      alt,
      caption
    },
    city-> {
      _id,
      title,
      "slug": slug.current,
      region
    },
    categories[]-> {
      _id,
      title,
      "slug": slug.current,
      icon,
      color
    },
    "reviews": *[_type == "review" && venue._ref == ^._id && published == true] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      author,
      visitDate,
      publishedAt,
      ratings,
      avgTicket,
      highlights,
      pros,
      cons,
      tldr,
      gallery[] {
        asset-> {
          _id,
          url
        },
        alt,
        caption
      },
      tags
    },
    "averageRating": count(*[_type == "review" && venue._ref == ^._id && published == true]) > 0 ? 
      math::avg(*[_type == "review" && venue._ref == ^._id && published == true]{
        "rating": coalesce(
          ratings.food,
          ratings.entertainment,
          ratings.facilities,
          0
        ) * 0.4 + 
        coalesce(ratings.service, 0) * 0.2 + 
        coalesce(ratings.ambience, 0) * 0.2 + 
        coalesce(ratings.value, 0) * 0.2
      }.rating) : 0,
    "reviewCount": count(*[_type == "review" && venue._ref == ^._id && published == true])
  }
`;

// Query para obtener reseña específica
export const reviewDetailQuery = groq`
  *[_type == "review" && slug.current == $reviewSlug && venue->slug.current == $venueSlug && venue->city->slug.current == $citySlug][0] {
    _id,
    title,
    "slug": slug.current,
    author,
    authorAvatar {
      asset-> {
        _id,
        url
      },
      alt
    },
    visitDate,
    publishedAt,
    ratings,
    avgTicket,
    highlights,
    pros,
    cons,
    tldr,
    "content": body,
    gallery[] {
      asset-> {
        _id,
        url
      },
      alt,
      caption
    },
    tags,
    faq[] {
      question,
      answer
    },
    venue-> {
      _id,
      title,
      "slug": slug.current,
      description,
      address,
      phone,
      website,
      geo,
      priceRange,
      images[] {
        asset-> {
          _id,
          url
        },
        alt,
        caption
      },
      city-> {
        _id,
        title,
        "slug": slug.current,
        region
      },
      categories[]-> {
        _id,
        title,
        "slug": slug.current,
        icon,
        color
      }
    }
  }
`;

// Query para obtener venues de una ciudad
export const venuesByCityQuery = groq`
  *[_type == "venue" && city->slug.current == $citySlug] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    address,
    priceRange,
    images[0] {
      asset-> {
        _id,
        url
      },
      alt
    },
    categories[]-> {
      _id,
      title,
      "slug": slug.current,
      icon,
      color
    },
    "averageRating": count(*[_type == "review" && venue._ref == ^._id && published == true]) > 0 ? 
      math::avg(*[_type == "review" && venue._ref == ^._id && published == true]{
        "rating": coalesce(
          ratings.food,
          ratings.entertainment,
          ratings.facilities,
          0
        ) * 0.4 + 
        coalesce(ratings.service, 0) * 0.2 + 
        coalesce(ratings.ambience, 0) * 0.2 + 
        coalesce(ratings.value, 0) * 0.2
      }.rating) : 0,
    "reviewCount": count(*[_type == "review" && venue._ref == ^._id && published == true])
  }
`;

// Query para obtener venues por categoría
export const venuesByCategoryQuery = groq`
  *[_type == "venue" && $categorySlug in categories[]->slug.current] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    address,
    priceRange,
    images[0] {
      asset-> {
        _id,
        url
      },
      alt
    },
    city-> {
      _id,
      title,
      "slug": slug.current,
      region
    },
    categories[]-> {
      _id,
      title,
      "slug": slug.current,
      icon,
      color
    },
    "averageRating": count(*[_type == "review" && venue._ref == ^._id && published == true]) > 0 ? 
      math::avg(*[_type == "review" && venue._ref == ^._id && published == true]{
        "rating": coalesce(
          ratings.food,
          ratings.entertainment,
          ratings.facilities,
          0
        ) * 0.4 + 
        coalesce(ratings.service, 0) * 0.2 + 
        coalesce(ratings.ambience, 0) * 0.2 + 
        coalesce(ratings.value, 0) * 0.2
      }.rating) : 0,
    "reviewCount": count(*[_type == "review" && venue._ref == ^._id && published == true])
  }
`;

// Obtener locales destacados agrupados por categoría maestra
export const venuesByMasterCategoryQuery = groq`{
  "gastro": *[_type == "venue" && masterCategory == "gastro"] | order(title asc)[0...8] {
    _id,
    title,
    "slug": slug.current,
    "citySlug": city->slug.current,
    address,
    priceRange,
    images[0] {
      asset-> { url }
    },
    "averageRating": count(*[_type == "review" && venue._ref == ^._id && published == true]) > 0 ? 
      math::avg(*[_type == "review" && venue._ref == ^._id && published == true]{
        "rating": coalesce(ratings.food, ratings.entertainment, ratings.facilities, 0)
      }.rating) : 0,
    "reviewCount": count(*[_type == "review" && venue._ref == ^._id && published == true])
  },
  "ocio": *[_type == "venue" && masterCategory == "ocio"] | order(title asc)[0...8] {
    _id,
    title,
    "slug": slug.current,
    "citySlug": city->slug.current,
    address,
    priceRange,
    images[0] {
      asset-> { url }
    },
    "averageRating": 0,
    "reviewCount": 0
  },
  "deportes": *[_type == "venue" && masterCategory == "deportes"] | order(title asc)[0...8] {
    _id,
    title,
    "slug": slug.current,
    "citySlug": city->slug.current,
    address,
    priceRange,
    images[0] {
      asset-> { url }
    },
    "averageRating": 0,
    "reviewCount": 0
  }
}`;
