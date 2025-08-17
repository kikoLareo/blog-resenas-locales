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
      name,
      _createdAt,
      "city": city->name
    }
  }
`;

// Query para listar reseñas con paginación
export const reviewsListQuery = `
  *[_type == "review"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    _updatedAt,
    publishedAt,
    "venue": venue->{
      name,
      "city": city->{name, slug}
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
  *[_type == "venue"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    _createdAt,
    _updatedAt,
    "city": city->{name, slug},
    address,
    phone,
    website,
    "reviewCount": count(*[_type == "review" && references(^._id)])
  }
`;

// Query para listar ciudades
export const citiesListQuery = `
  *[_type == "city"] | order(name asc) {
    _id,
    name,
    slug,
    _createdAt,
    _updatedAt,
    "venueCount": count(*[_type == "venue" && references(^._id)]),
    "reviewCount": count(*[_type == "review" && venue->city._ref == ^._id])
  }
`;

// Query para listar categorías
export const categoriesListQuery = `
  *[_type == "category"] | order(name asc) {
    _id,
    name,
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
      name,
      slug,
      "city": city->{name, slug}
    }
  }
`;

// Query para obtener un local específico
export const venueByIdQuery = `
  *[_type == "venue" && _id == $id][0] {
    _id,
    name,
    slug,
    description,
    address,
    phone,
    website,
    hours,
    coordinates,
    _createdAt,
    _updatedAt,
    "city": city->{_id, name, slug},
    "categories": categories[]->{_id, name},
    "reviews": *[_type == "review" && references(^._id)] {
      _id,
      title,
      slug,
      ratings,
      _createdAt
    }
  }
`;

// Query para obtener estadísticas del dashboard
export const dashboardOverviewQuery = `
  {
    "stats": {
      "totalReviews": count(*[_type == "review"]),
      "totalVenues": count(*[_type == "venue"]),
      "totalCities": count(*[_type == "city"]),
      "totalPosts": count(*[_type == "post"])
    },
    "recentActivity": {
      "reviews": *[_type == "review"] | order(_createdAt desc)[0...5] {
        _id,
        title,
        _createdAt,
        "venue": venue->{name, "city": city->name}
      },
      "venues": *[_type == "venue"] | order(_createdAt desc)[0...5] {
        _id,
        name,
        _createdAt,
        "city": city->name
      }
    }
  }
`;