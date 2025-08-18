// Queries para el dashboard
export const dashboardStatsQuery = `
  {
    "totalReviews": count(*[_type == "review"]),
    "totalVenues": count(*[_type == "venue"]),
    "totalCities": count(*[_type == "city"]),
    "totalPosts": count(*[_type == "post"]),
    "totalCategories": count(*[_type == "category"]),
    "recentReviews": *[_type == "review"] | order(_createdAt desc)[0...5] {
      _id,
      title,
      _createdAt,
      "venue": venue->{name, "city": city->name},
      ratings
    },
                    "recentVenues": *[_type == "venue"] | order(_createdAt desc)[0...5] {
                  _id,
                  title,
                  _createdAt,
                  "city": city->title
                }
  }
`;

// Query para listar reseñas
export const reviewsListQuery = `
  *[_type == "review"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    _updatedAt,
    publishedAt,
                    "venue": venue->{
                  title,
                  "city": city->{title, slug}
                },
    ratings,
    "status": select(
      publishedAt != null => "published",
      "draft"
    )
  }
`;

// Query para listar locales
export const venuesListQuery = `
  *[_type == "venue"] | order(title asc) {
    _id,
    title,
    slug,
    _createdAt,
    _updatedAt,
    "city": city->{title, slug},
    address,
    phone,
    website,
    priceRange,
    "reviewCount": count(*[_type == "review" && references(^._id)])
  }
`;

// Query para listar ciudades
export const citiesListQuery = `
  *[_type == "city"] | order(title asc) {
    _id,
    title,
    slug,
    _createdAt,
    _updatedAt,
    "venueCount": count(*[_type == "venue" && references(^._id)]),
    "reviewCount": count(*[_type == "review" && venue->city._ref == ^._id])
  }
`;

// Query para listar categorías
export const categoriesListQuery = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    _createdAt,
    _updatedAt,
    description,
    "venueCount": count(*[_type == "venue" && references(^._id)])
  }
`;

// Query para listar posts del blog
export const blogPostsListQuery = `
  *[_type == "post"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    _updatedAt,
    publishedAt,
    excerpt,
    "author": author->name,
    "status": select(
      publishedAt != null => "published",
      "draft"
    )
  }
`;

// Query para obtener una reseña específica
export const reviewByIdQuery = `
  *[_type == "review" && _id == $id][0] {
    _id,
    title,
    slug,
    content,
    tldr,
    ratings,
    pros,
    cons,
    gallery,
    _createdAt,
    _updatedAt,
    publishedAt,
    "venue": venue->{
      _id,
      title,
      slug,
      "city": city->{title, slug}
    }
  }
`;

// Query para obtener un local específico
export const venueByIdQuery = `
  *[_type == "venue" && _id == $id][0] {
    _id,
    title,
    slug,
    description,
    address,
    phone,
    website,
    openingHours,
    geo,
    priceRange,
    schemaType,
    social,
    _createdAt,
    _updatedAt,
    "city": city->{_id, title, slug},
    "categories": categories[]->{_id, title},
    "reviews": *[_type == "review" && references(^._id)] {
      _id,
      title,
      slug,
      ratings,
      _createdAt
    }
  }
`;

// Query para obtener locales por ciudad
export const venuesByCityQuery = `
  *[_type == "venue" && city->slug.current == $citySlug] | order(title asc) {
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

// Query para obtener una ciudad específica
export const cityByIdQuery = `
  *[_type == "city" && _id == $id][0] {
    _id,
    title,
    slug,
    description,
    region,
    "venues": *[_type == "venue" && references(^._id)] {
      _id,
      title,
      slug,
      address,
      phone,
      website,
      priceRange,
      "reviewCount": count(*[_type == "review" && references(^._id)]),
      _createdAt
    },
    "reviews": *[_type == "review" && venue->city._ref == ^._id] {
      _id,
      title,
      slug,
      "venue": venue->{title, slug},
      ratings,
      _createdAt
    },
    _createdAt,
    _updatedAt
  }
`;

// Query para obtener una categoría específica
export const categoryByIdQuery = `
  *[_type == "category" && _id == $id][0] {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    "venues": *[_type == "venue" && references(^._id)] {
      _id,
      title,
      slug,
      address,
      phone,
      website,
      priceRange,
      "city": city->{title, slug},
      "reviewCount": count(*[_type == "review" && references(^._id)]),
      _createdAt
    },
    "reviews": *[_type == "review" && venue->categories[]._ref == ^._id] {
      _id,
      title,
      slug,
      "venue": venue->{title, slug, "city": city->{title, slug}},
      ratings,
      _createdAt
    },
    _createdAt,
    _updatedAt
  }
`;