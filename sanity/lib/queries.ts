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

// Query temporal con datos mock para desarrollo
export const venueQueryMock = `
  {
    "_id": "venue-madrid-cafe-encanto",
    "title": "Café con Encanto",
    "slug": {
      "current": "cafe-con-encanto"
    },
    "description": "Un acogedor café en el corazón de Madrid, perfecto para disfrutar de un buen café y pastelería artesanal. Ambiente relajado y terraza exterior.",
    "address": "Plaza Mayor 3, Madrid",
    "postalCode": "28012",
    "phone": "+34 91 123 45 67",
    "website": "https://cafeconencanto.es",
    "openingHours": ["Lu-Vi 8:00-22:00", "Sa-Do 9:00-23:00"],
    "priceRange": "€",
    "schemaType": "CafeOrCoffeeShop",
    "images": [
      {
        "_type": "image",
        "asset": {
          "_ref": "image-123",
          "_type": "reference"
        },
        "alt": "Café con Encanto - Interior"
      }
    ],
    "geo": {
      "lat": 40.4155,
      "lng": -3.7074
    },
    "social": {
      "instagram": "https://instagram.com/cafeconencanto",
      "facebook": "https://facebook.com/cafeconencanto",
      "maps": "https://maps.google.com/?q=Plaza+Mayor+3+Madrid"
    },
    "city": {
      "_id": "city-madrid",
      "title": "Madrid",
      "slug": {
        "current": "madrid"
      },
      "region": "Madrid"
    },
    "categories": [
      {
        "_id": "cat-cafe",
        "title": "Café y Brunch",
        "slug": {
          "current": "cafe-brunch"
        },
        "icon": "coffee",
        "color": "brown"
      }
    ],
    "reviews": [
      {
        "_id": "review-cafe-encanto-brunch",
        "title": "Brunch de fin de semana en Café con Encanto",
        "slug": {
          "current": "brunch-cafe-encanto-madrid"
        },
        "visitDate": "2025-07-27",
        "ratings": {
          "food": 8,
          "service": 8,
          "ambience": 9,
          "value": 8
        },
        "tldr": "Brunch sencillo pero bien resuelto con buen café en el centro.",
        "author": "Equipo",
        "gallery": [
          {
            "_type": "image",
            "asset": {
              "_ref": "image-456",
              "_type": "reference"
            }
          }
        ]
      }
    ]
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
      "city": city->title
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
    )
  }
`;

// Filtrar por categoría con paginación
export const venuesByCategoryQuery = `
  *[_type == "venue" && $categorySlug in categories[]->slug.current] | order(title asc) [$offset...$limit] {
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
  count(*[_type == "venue" && $categorySlug in categories[]->slug.current])
`;

// ===== QUERIES PARA PÁGINAS ESPECIALES =====

// Datos para homepage
export const homepageQuery = `{
  "featuredReviews": *[_type == "review"] | order(ratings.food desc)[0...3] {
    _id,
    title,
    slug,
    ratings,
    gallery[0],
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
    "venueCount": count(*[_type == "venue" && ^._id in categories[]._ref])
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