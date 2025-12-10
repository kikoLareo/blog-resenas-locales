// Queries GROQ optimizadas para el Blog de Reseñas de Locales
// Estas queries están listas para usar en tu aplicación Next.js

// ===== QUERIES BÁSICAS =====

// Obtener todas las ciudades
export const citiesQuery = `
  *[_type == "city"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    region,
    description,
    heroImage,
    featured,
    geo,
    population,
    highlights,
    cuisineSpecialties
  }
`;

// Obtener ciudad individual con metadatos
export const cityQuery = `
  *[_type == "city" && slug.current == $citySlug][0] {
    _id,
    title,
    slug,
    region,
    description,
    heroImage,
    featured,
    geo,
    population,
    highlights,
    cuisineSpecialties,
    "venueCount": count(*[_type == "venue" && city._ref == ^._id]),
    "reviewCount": count(*[_type == "review" && venue->city._ref == ^._id])
  }
`;

// Obtener categorías destacadas
export const featuredCategoriesQuery = `
  *[_type == "category" && featured == true] | order(order asc) {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    heroImage,
    cuisineType,
    priceRangeTypical
  }
`;

// Obtener categoría individual con metadatos
export const categoryQuery = `
  *[_type == "category" && slug.current == $categorySlug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    heroImage,
    cuisineType,
    priceRangeTypical,
    "venueCount": count(*[_type == "venue" && ^._id in categories[]._ref]),
    "reviewCount": count(*[_type == "review" && ^._id in venue->categories[]._ref])
  }
`;

// ===== QUERIES DE LOCALES =====

// Obtener todos los locales con información básica
export const venuesQuery = `
  *[_type == "venue"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    priceRange,
    images[0],
    "city": city->title,
    "citySlug": city->slug.current,
    "categories": categories[]->title,
    geo
  }
`;

// Obtener locales por ciudad con paginación
export const venuesByCityQuery = `
  *[_type == "venue" && city->slug.current == $citySlug] | order(title asc) [$offset...$limit] {
    _id,
    title,
    slug,
    description,
    priceRange,
    images[0],
    "city": city-> {
      title,
      slug
    },
    "categories": categories[]-> {
      title,
      slug
    },
    geo,
    address,
    phone,
    website
  }
`;

// Contar locales por ciudad para paginación
export const venuesByCityCountQuery = `
  count(*[_type == "venue" && city->slug.current == $citySlug])
`;

// Obtener local individual con toda la información
export const venueQuery = `
  *[_type == "venue" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    address,
    postalCode,
    phone,
    website,
    openingHours,
    priceRange,
    schemaType,
    images,
    geo,
    social,
    "city": city-> {
      _id,
      title,
      slug,
      region
    },
    "categories": categories[]-> {
      _id,
      title,
      slug,
      icon,
      color
    },
    "reviews": *[_type == "review" && venue._ref == ^._id] | order(visitDate desc) {
      _id,
      title,
      slug,
      visitDate,
      ratings,
      tldr,
      author,
      gallery[0]
    }
  }
`;

// ===== QUERIES DE RESEÑAS =====

// Obtener reseñas recientes
export const recentReviewsQuery = `
  *[_type == "review"] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    tldr,
    visitDate,
    publishedAt,
    ratings,
    author,
    authorAvatar,
    gallery[0],
    "venue": venue-> {
      title,
      slug,
      "city": city->title
    }
  }
`;

// Obtener reseña individual completa
export const reviewQuery = `
  *[_type == "review" && slug.current == $slug][0] {
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
    faq,
    body,
    gallery,
    author,
    authorAvatar,
    tags,
    "venue": venue-> {
      _id,
      title,
      slug,
      address,
      phone,
      website,
      priceRange,
      geo,
      "city": city-> {
        title,
        slug,
        region
      },
      "categories": categories[]-> {
        title,
        slug,
        icon
      }
    }
  }
`;

// Obtener mejores reseñas (por puntuación de comida)
export const topReviewsQuery = `
  *[_type == "review" && ratings.food >= 8] | order(ratings.food desc)[0...10] {
    _id,
    title,
    slug,
    ratings,
    tldr,
    visitDate,
    gallery[0],
    "venue": venue-> {
      title,
      slug,
      "city": city-> {
        title,
        slug
      }
    }
  }
`;

// ===== QUERIES DE POSTS =====

// Obtener posts recientes
export const recentPostsQuery = `
  *[_type == "post"] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    readingTime,
    featured,
    heroImage,
    author,
    "categories": categories[]->title
  }
`;

// Obtener post individual
export const postQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    body,
    publishedAt,
    updatedAt,
    readingTime,
    author,
    authorAvatar,
    tags,
    hasFaq,
    faq,
    tldr,
    "categories": categories[]-> {
      title,
      slug,
      icon,
      color
    },
    "relatedVenues": relatedVenues[]-> {
      title,
      slug,
      "city": city->title
    }
  }
`;

// Obtener posts destacados
export const featuredPostsQuery = `
  *[_type == "post" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    publishedAt,
    author,
    "categories": categories[]->title
  }
`;

// ===== QUERIES DE BÚSQUEDA Y FILTROS =====

// Búsqueda general
export const searchQuery = `
  *[_type in ["venue", "review", "post"] && (
    title match $searchTerm + "*" ||
    description match $searchTerm + "*" ||
    excerpt match $searchTerm + "*"
  )] | order(_score desc)[0...20] {
    _type,
    _id,
    title,
    slug,
    description,
    excerpt,
    "image": coalesce(heroImage, images[0], gallery[0]),
    "venue": select(
      _type == "review" => venue->title,
      _type == "venue" => title
    ),
    "city": select(
      _type == "venue" => city->title,
      _type == "review" => venue->city->title
    ),
    "venueSlug": select(
      _type == "review" => venue->slug.current,
      _type == "venue" => slug.current
    ),
    "citySlug": select(
      _type == "venue" => city->slug.current,
      _type == "review" => venue->city->slug.current
    )
  }
`;

// Filtrar por categoría con paginación
export const venuesByCategoryQuery = `
  *[_type == "venue" && categories[0]->slug.current == $categorySlug] | order(title asc) [$offset...$limit] {
    _id,
    title,
    slug,
    description,
    priceRange,
    images[0],
    "city": city-> {
      title,
      slug
    },
    "categories": categories[]-> {
      title,
      slug
    },
    address,
    phone,
    website
  }
`;

// Contar locales por categoría para paginación
export const venuesByCategoryCountQuery = `
  count(*[_type == "venue" && categories[0]->slug.current == $categorySlug])
`;

// ===== QUERIES PARA PÁGINAS ESPECIALES =====

// Datos para homepage
export const homepageQuery = `{
  "heroItems": *[_type == "review" && published == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    ratings,
    tldr,
    summary,
    tags,
    publishedAt,
    readTime,
    gallery[0] {
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    "venue": venue-> {
      title,
      slug,
      address,
      priceRange,
      cuisine,
      "city": city->{
        title,
        slug
      },
      "citySlug": city->slug.current
    },
    author
  },
  "featuredReviews": *[_type == "review" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    ratings,
    tldr,
    gallery[0] {
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    "venue": venue-> {
      title,
      slug,
      "city": city->title,
      "citySlug": city->slug.current
    }
  },
  "trendingReviews": *[_type == "review"] | order(ratings.food desc, publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    ratings,
    tldr,
    gallery[0] {
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    "venue": venue-> {
      title,
      slug,
      "city": city->title,
      "citySlug": city->slug.current
    }
  },
  "topReviews": *[_type == "review" && ratings.food >= 8.0] | order(ratings.food desc, publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    ratings,
    tldr,
    gallery[0] {
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    "venue": venue-> {
      title,
      slug,
      "city": city->title,
      "citySlug": city->slug.current
    }
  },
  "featuredPosts": *[_type == "post" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    publishedAt
  },
  "featuredCities": *[_type == "city" && featured == true] | order(order asc)[0...4] {
    _id,
    title,
    slug,
    description,
    heroImage,
    "venueCount": count(*[_type == "venue" && city._ref == ^._id])
  },
  "featuredCategories": *[_type == "category" && featured == true] | order(order asc)[0...6] {
    _id,
    title,
    slug,
    icon,
    color,
    description,
    heroImage {
      asset->{
        _id,
        url
      }
    },
    "venueCount": count(*[_type == "venue" && ^._id in categories[]._ref])
  },
  "featuredVenues": *[_type == "venue" && featured == true] | order(order asc)[0...8] {
    _id,
    title,
    slug,
    address,
    priceRange,
    openingHours,
    images[0] {
      asset->{
        _id,
        url
      }
    },
    city->{
      _id,
      title,
      slug
    },
    categories[0]->{
      title
    },
    "reviews": *[_type == "review" && venue._ref == ^._id] {
      ratings
    }
  }
}`;

// Datos para sitemap
export const sitemapQuery = `{
  "venues": *[_type == "venue"] { slug, _updatedAt },
  "reviews": *[_type == "review"] { slug, publishedAt },
  "posts": *[_type == "post"] { slug, publishedAt },
  "cities": *[_type == "city"] { slug, _updatedAt },
  "categories": *[_type == "category"] { slug, _updatedAt }
}`;

// ===== QUERIES PARA SEO Y METADATA =====

// Obtener datos para JSON-LD de local
export const venueJsonLdQuery = `
  *[_type == "venue" && slug.current == $slug][0] {
    title,
    description,
    address,
    phone,
    website,
    priceRange,
    schemaType,
    geo,
    images,
    openingHours,
    "city": city-> {
      title,
      region
    },
    "reviews": *[_type == "review" && venue._ref == ^._id] {
      ratings,
      author,
      visitDate
    }
  }
`;

// Obtener datos para JSON-LD de reseña
export const reviewJsonLdQuery = `
  *[_type == "review" && slug.current == $slug][0] {
    title,
    author,
    publishedAt,
    ratings,
    body,
    "venue": venue-> {
      title,
      address,
      phone,
      "city": city->title
    }
  }
`;

// ===== QUERIES PARA CÓDIGOS QR =====

// Obtener todos los códigos QR
export const qrCodesListQuery = `
  *[_type == "qrCode"] {
    _id,
    title,
    code,
    isActive,
    expiresAt,
    maxUses,
    currentUses,
    lastUsedAt,
    description,
    venue->{
      _id,
      title,
      slug
    }
  } | order(_createdAt desc)
`;

// Obtener código QR por código único
export const qrCodeByCodeQuery = `
  *[_type == "qrCode" && code == $code][0] {
    _id,
    title,
    code,
    isActive,
    expiresAt,
    maxUses,
    currentUses,
    lastUsedAt,
    description,
    venue->{
      _id,
      title,
      slug,
      city->{
        title,
        slug
      }
    }
  }
`;

// Obtener códigos QR por local
export const qrCodesByVenueQuery = `
  *[_type == "qrCode" && venue._ref == $venueId] {
    _id,
    title,
    code,
    isActive,
    expiresAt,
    maxUses,
    currentUses,
    lastUsedAt,
    description
  } | order(_createdAt desc)
`;

// ===== QR FEEDBACK =====

// Obtener todo el feedback de QR
export const qrFeedbackListQuery = `
  *[_type == "qrFeedback"] {
    _id,
    _createdAt,
    venue->{
      _id,
      title,
      slug,
      city->{
        title,
        slug
      }
    },
    qrCode,
    name,
    email,
    phone,
    visitDate,
    visitTime,
    partySize,
    occasion,
    specialRequests,
    rating,
    feedback,
    submittedAt,
    status
  } | order(_createdAt desc)
`;

// Obtener feedback por local
export const qrFeedbackByVenueQuery = `
  *[_type == "qrFeedback" && venue._ref == $venueId] {
    _id,
    _createdAt,
    qrCode,
    name,
    email,
    phone,
    visitDate,
    visitTime,
    partySize,
    occasion,
    specialRequests,
    rating,
    feedback,
    submittedAt,
    status
  } | order(_createdAt desc)
`;

// Obtener feedback pendiente
export const qrFeedbackPendingQuery = `
  *[_type == "qrFeedback" && status == "pending"] {
    _id,
    _createdAt,
    venue->{
      _id,
      title,
      slug
    },
    qrCode,
    name,
    email,
    phone,
    visitDate,
    visitTime,
    partySize,
    occasion,
    specialRequests,
    rating,
    feedback,
    submittedAt,
    status
  } | order(_createdAt desc)
`;

// ===== VENUE SUBMISSIONS =====

// Obtener todas las solicitudes de locales
export const venueSubmissionsListQuery = `
  *[_type == "venueSubmission"] {
    _id,
    status,
    title,
    slug,
    submittedAt,
    submittedBy,
    email,
    phone,
    city->{
      _id,
      title,
      slug
    },
    categories[]->{
      _id,
      title,
      slug
    },
    qrCode->{
      _id,
      code,
      title
    },
    approvedAt,
    createdVenue->{
      _id,
      title,
      slug
    }
  } | order(submittedAt desc)
`;

// Obtener solicitudes pendientes
export const venueSubmissionsPendingQuery = `
  *[_type == "venueSubmission" && status == "pending"] {
    _id,
    status,
    title,
    slug,
    submittedAt,
    submittedBy,
    email,
    phone,
    city->{
      _id,
      title,
      slug
    },
    categories[]->{
      _id,
      title,
      slug
    },
    qrCode->{
      _id,
      code,
      title
    }
  } | order(submittedAt desc)
`;

// Obtener solicitud individual
export const venueSubmissionByIdQuery = `
  *[_type == "venueSubmission" && _id == $id][0] {
    _id,
    status,
    title,
    slug,
    description,
    address,
    postalCode,
    city->{
      _id,
      title,
      slug
    },
    categories[]->{
      _id,
      title,
      slug
    },
    phone,
    email,
    website,
    priceRange,
    openingHours,
    geo,
    images,
    qrCode->{
      _id,
      code,
      title
    },
    submittedAt,
    submittedBy,
    approvedAt,
    approvedBy,
    rejectionReason,
    createdVenue->{
      _id,
      title,
      slug
    },
    internalNotes
  }
`;

// Obtener QR code con validación de onboarding
export const qrCodeOnboardingQuery = `
  *[_type == "qrCode" && code == $code][0] {
    _id,
    title,
    code,
    isActive,
    isOnboarding,
    isUsed,
    usedAt,
    expiresAt,
    venue->{
      _id,
      title,
      slug
    },
    submission->{
      _id,
      status,
      title
    }
  }
`;

// ===== HOMEPAGE CONFIGURATION =====

// Obtener configuración de homepage
export const homepageConfigQuery = `
  *[_type == "homepageConfig"][0] {
    _id,
    title,
    sections,
    lastModified
  }
`;