import { groq } from 'next-sanity';

// Query para obtener todos los elementos destacados activos
export const getFeaturedItems = groq`
  *[
    _type == "featuredItem" 
    && isActive == true 
    && (!defined(publishDate) || publishDate <= now())
    && (!defined(expiryDate) || expiryDate >= now())
  ] | order(order asc) {
    _id,
    title,
    type,
    customTitle,
    customSubtitle,
    customDescription,
    customImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt
    },
    customCTA,
    seoTitle,
    seoDescription,
    seoKeywords,
    order,
    isActive,
    publishDate,
    
    // Datos específicos según el tipo
    type == "review" => {
      reviewRef->{
        _id,
        title,
        slug,
        venue->{
          title,
          slug,
          city->{ title, slug }
        },
        ratings,
        visitDate,
        image {
          asset->{ url },
          alt
        },
        summary,
        tags
      }
    },
    
    type == "venue" => {
      venueRef->{
        _id,
        title,
        slug,
        city->{ title, slug },
        address,
        category->{
          title,
          slug
        },
        image {
          asset->{ url },
          alt
        },
        description,
        averageRating,
        reviewCount,
        priceRange,
        highlights
      }
    },
    
    type == "category" => {
      categoryRef->{
        _id,
        title,
        slug,
        description,
        image {
          asset->{ url },
          alt
        },
        color,
        icon,
        // Conteo de reseñas en esta categoría
        "reviewCount": count(*[_type == "review" && venue->category._ref == ^._id]),
        "venueCount": count(*[_type == "venue" && category._ref == ^._id])
      }
    },
    
    // Para colecciones y guías personalizadas
    type in ["collection", "guide"] => {
      customContent
    }
  }
`;

// Query para obtener un elemento destacado específico
export const getFeaturedItemById = groq`
  *[_type == "featuredItem" && _id == $id][0] {
    _id,
    title,
    type,
    customTitle,
    customSubtitle,
    customDescription,
    customImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt
    },
    customCTA,
    seoTitle,
    seoDescription,
    seoKeywords,
    order,
    isActive,
    publishDate,
    expiryDate,
    
    // Datos específicos según el tipo
    type == "review" => {
      reviewRef->{
        _id,
        title,
        slug,
        venue->{
          title,
          slug,
          city->{ title, slug }
        },
        ratings,
        visitDate,
        image {
          asset->{ url },
          alt
        },
        summary,
        tags
      }
    },
    
    type == "venue" => {
      venueRef->{
        _id,
        title,
        slug,
        city->{ title, slug },
        address,
        category->{
          title,
          slug
        },
        image {
          asset->{ url },
          alt
        },
        description,
        averageRating,
        reviewCount,
        priceRange,
        highlights
      }
    },
    
    type == "category" => {
      categoryRef->{
        _id,
        title,
        slug,
        description,
        image {
          asset->{ url },
          alt
        },
        color,
        icon,
        "reviewCount": count(*[_type == "review" && venue->category._ref == ^._id]),
        "venueCount": count(*[_type == "venue" && category._ref == ^._id])
      }
    },
    
    type in ["collection", "guide"] => {
      customContent
    }
  }
`;

// Query para admin - todos los elementos destacados con más detalles
export const getAllFeaturedItemsAdmin = groq`
  *[_type == "featuredItem"] | order(order asc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    type,
    customTitle,
    customSubtitle,
    customDescription,
    customImage {
      asset->{
        _id,
        url
      },
      alt
    },
    customCTA,
    seoTitle,
    seoDescription,
    seoKeywords,
    order,
    isActive,
    publishDate,
    expiryDate,
    trackingId,
    
    // Referencias básicas para mostrar en lista
    reviewRef->{
      title,
      slug,
      venue->{ title }
    },
    venueRef->{
      title,
      slug
    },
    categoryRef->{
      title,
      slug
    },
    
    // AI suggestions si existen
    aiSuggestions
  }
`;

// Query para estadísticas del carrusel
export const getFeaturedItemsStats = groq`
  {
    "total": count(*[_type == "featuredItem"]),
    "active": count(*[_type == "featuredItem" && isActive == true]),
    "byType": {
      "review": count(*[_type == "featuredItem" && type == "review"]),
      "venue": count(*[_type == "featuredItem" && type == "venue"]),
      "category": count(*[_type == "featuredItem" && type == "category"]),
      "collection": count(*[_type == "featuredItem" && type == "collection"]),
      "guide": count(*[_type == "featuredItem" && type == "guide"])
    },
    "scheduled": count(*[_type == "featuredItem" && publishDate > now()]),
    "expired": count(*[_type == "featuredItem" && defined(expiryDate) && expiryDate < now()])
  }
`;
