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
    "averageRating": math::avg(*[_type == "review" && venue._ref == ^._id && published == true].ratings.overall),
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
    content,
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
    "averageRating": math::avg(*[_type == "review" && venue._ref == ^._id && published == true].ratings.overall),
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
    "averageRating": math::avg(*[_type == "review" && venue._ref == ^._id && published == true].ratings.overall),
    "reviewCount": count(*[_type == "review" && venue._ref == ^._id && published == true])
  }
`;
