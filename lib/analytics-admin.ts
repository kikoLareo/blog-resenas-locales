// Funciones para obtener estadísticas y analytics del sistema
import { adminSanityClient } from './admin-sanity';

export interface DashboardStats {
  totalReviews: number;
  totalVenues: number;
  totalCities: number;
  totalPosts: number;
  totalCategories: number;
  publishedReviews: number;
  draftReviews: number;
  publishedPosts: number;
  draftPosts: number;
}

export interface ContentStats {
  recentReviews: Array<{
    _id: string;
    title: string;
    _createdAt: string;
    published: boolean;
    venue: {
      title: string;
      city: string;
    };
    ratings: any;
  }>;
  recentVenues: Array<{
    _id: string;
    title: string;
    _createdAt: string;
    city: string;
  }>;
  recentPosts: Array<{
    _id: string;
    title: string;
    _createdAt: string;
    publishedAt: string | null;
    excerpt: string;
  }>;
}

export interface PopularContent {
  topReviews: Array<{
    _id: string;
    title: string;
    slug: string;
    venue: {
      title: string;
      slug: string;
      city: {
        title: string;
        slug: string;
      };
    };
    ratings: any;
    _createdAt: string;
  }>;
  topVenues: Array<{
    _id: string;
    title: string;
    slug: string;
    city: {
      title: string;
      slug: string;
    };
    reviewCount: number;
  }>;
  topCategories: Array<{
    _id: string;
    title: string;
    slug: string;
    venueCount: number;
  }>;
}

export interface TimeSeriesData {
  reviewsByMonth: Array<{
    month: string;
    count: number;
  }>;
  venuesByMonth: Array<{
    month: string;
    count: number;
  }>;
  postsByMonth: Array<{
    month: string;
    count: number;
  }>;
}

/**
 * Obtener estadísticas generales del dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const query = `{
      "totalReviews": count(*[_type == "review"]),
      "totalVenues": count(*[_type == "venue"]),
      "totalCities": count(*[_type == "city"]),
      "totalPosts": count(*[_type == "post"]),
      "totalCategories": count(*[_type == "category"]),
      "publishedReviews": count(*[_type == "review" && published == true]),
      "draftReviews": count(*[_type == "review" && published != true]),
      "publishedPosts": count(*[_type == "post" && defined(publishedAt)]),
      "draftPosts": count(*[_type == "post" && !defined(publishedAt)])
    }`;
    
    const stats = await adminSanityClient.fetch(query);
    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalReviews: 0,
      totalVenues: 0,
      totalCities: 0,
      totalPosts: 0,
      totalCategories: 0,
      publishedReviews: 0,
      draftReviews: 0,
      publishedPosts: 0,
      draftPosts: 0,
    };
  }
}

/**
 * Obtener contenido reciente
 */
export async function getRecentContent(): Promise<ContentStats> {
  try {
    const query = `{
      "recentReviews": *[_type == "review"] | order(_createdAt desc)[0...5] {
        _id,
        title,
        _createdAt,
        published,
        "venue": venue->{
          title,
          "city": city->title
        },
        ratings
      },
      "recentVenues": *[_type == "venue"] | order(_createdAt desc)[0...5] {
        _id,
        title,
        _createdAt,
        "city": city->title
      },
      "recentPosts": *[_type == "post"] | order(_createdAt desc)[0...5] {
        _id,
        title,
        _createdAt,
        publishedAt,
        excerpt
      }
    }`;
    
    const content = await adminSanityClient.fetch(query);
    return content;
  } catch (error) {
    console.error('Error fetching recent content:', error);
    return {
      recentReviews: [],
      recentVenues: [],
      recentPosts: [],
    };
  }
}

/**
 * Obtener contenido más popular (por número de relaciones o fecha)
 */
export async function getPopularContent(): Promise<PopularContent> {
  try {
    const query = `{
      "topReviews": *[_type == "review" && published == true] | order(_createdAt desc)[0...10] {
        _id,
        title,
        slug,
        "venue": venue->{
          title,
          slug,
          "city": city->{title, slug}
        },
        ratings,
        _createdAt
      },
      "topVenues": *[_type == "venue"] | order(title asc)[0...10] {
        _id,
        title,
        slug,
        "city": city->{title, slug},
        "reviewCount": count(*[_type == "review" && references(^._id)])
      },
      "topCategories": *[_type == "category"] | order(title asc)[0...10] {
        _id,
        title,
        slug,
        "venueCount": count(*[_type == "venue" && references(^._id)])
      }
    }`;
    
    const content = await adminSanityClient.fetch(query);
    return content;
  } catch (error) {
    console.error('Error fetching popular content:', error);
    return {
      topReviews: [],
      topVenues: [],
      topCategories: [],
    };
  }
}

/**
 * Obtener estadísticas de crecimiento por mes (últimos 6 meses)
 */
export async function getGrowthStats(): Promise<TimeSeriesData> {
  try {
    // Calcular fecha de hace 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const cutoffDate = sixMonthsAgo.toISOString();

    const query = `{
      "reviews": *[_type == "review" && _createdAt > "${cutoffDate}"] {
        _createdAt
      },
      "venues": *[_type == "venue" && _createdAt > "${cutoffDate}"] {
        _createdAt
      },
      "posts": *[_type == "post" && _createdAt > "${cutoffDate}"] {
        _createdAt
      }
    }`;
    
    const data = await adminSanityClient.fetch(query);
    
    // Agrupar por mes
    const reviewsByMonth = groupByMonth(data.reviews || []);
    const venuesByMonth = groupByMonth(data.venues || []);
    const postsByMonth = groupByMonth(data.posts || []);

    return {
      reviewsByMonth,
      venuesByMonth,
      postsByMonth,
    };
  } catch (error) {
    console.error('Error fetching growth stats:', error);
    return {
      reviewsByMonth: [],
      venuesByMonth: [],
      postsByMonth: [],
    };
  }
}

/**
 * Helper: Agrupar items por mes
 */
function groupByMonth(items: Array<{ _createdAt: string }>): Array<{ month: string; count: number }> {
  const monthCounts: Record<string, number> = {};
  
  items.forEach(item => {
    const date = new Date(item._createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  });

  // Convertir a array y ordenar
  return Object.entries(monthCounts)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Obtener estadísticas de ratings promedio
 */
export async function getRatingsStats() {
  try {
    const query = `{
      "reviews": *[_type == "review" && published == true && defined(ratings)] {
        ratings {
          food,
          service,
          atmosphere,
          value
        }
      }
    }`;
    
    const data = await adminSanityClient.fetch(query);
    const reviews = data.reviews || [];

    if (reviews.length === 0) {
      return {
        averageFood: 0,
        averageService: 0,
        averageAtmosphere: 0,
        averageValue: 0,
        averageOverall: 0,
        totalReviews: 0,
      };
    }

    let totalFood = 0;
    let totalService = 0;
    let totalAtmosphere = 0;
    let totalValue = 0;

    reviews.forEach((review: any) => {
      if (review.ratings) {
        totalFood += review.ratings.food || 0;
        totalService += review.ratings.service || 0;
        totalAtmosphere += review.ratings.atmosphere || 0;
        totalValue += review.ratings.value || 0;
      }
    });

    const count = reviews.length;
    const avgFood = totalFood / count;
    const avgService = totalService / count;
    const avgAtmosphere = totalAtmosphere / count;
    const avgValue = totalValue / count;
    const avgOverall = (avgFood + avgService + avgAtmosphere + avgValue) / 4;

    return {
      averageFood: Math.round(avgFood * 10) / 10,
      averageService: Math.round(avgService * 10) / 10,
      averageAtmosphere: Math.round(avgAtmosphere * 10) / 10,
      averageValue: Math.round(avgValue * 10) / 10,
      averageOverall: Math.round(avgOverall * 10) / 10,
      totalReviews: count,
    };
  } catch (error) {
    console.error('Error fetching ratings stats:', error);
    return {
      averageFood: 0,
      averageService: 0,
      averageAtmosphere: 0,
      averageValue: 0,
      averageOverall: 0,
      totalReviews: 0,
    };
  }
}

/**
 * Obtener estadísticas por ciudad
 */
export async function getCityStats() {
  try {
    const query = `*[_type == "city"] {
      _id,
      title,
      slug,
      "venueCount": count(*[_type == "venue" && references(^._id)]),
      "reviewCount": count(*[_type == "review" && venue->city._ref == ^._id]),
      "publishedReviewCount": count(*[_type == "review" && published == true && venue->city._ref == ^._id])
    } | order(reviewCount desc)[0...10]`;
    
    const cities = await adminSanityClient.fetch(query);
    return cities || [];
  } catch (error) {
    console.error('Error fetching city stats:', error);
    return [];
  }
}

/**
 * Obtener estadísticas por categoría
 */
export async function getCategoryStats() {
  try {
    const query = `*[_type == "category"] {
      _id,
      title,
      slug,
      "venueCount": count(*[_type == "venue" && references(^._id)]),
      "reviewCount": count(*[_type == "review" && ^._id in venue->categories[]._ref])
    } | order(venueCount desc)[0...10]`;
    
    const categories = await adminSanityClient.fetch(query);
    return categories || [];
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return [];
  }
}

