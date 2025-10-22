import { NextResponse } from 'next/server';
import {
  getDashboardStats,
  getRecentContent,
  getPopularContent,
  getGrowthStats,
  getRatingsStats,
  getCityStats,
  getCategoryStats,
} from '@/lib/analytics-admin';

/**
 * GET /api/admin/analytics
 * Obtiene todas las estadísticas del dashboard
 * Query params:
 * - type: 'overview' | 'content' | 'popular' | 'growth' | 'ratings' | 'cities' | 'categories' | 'all'
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    switch (type) {
      case 'overview':
        const stats = await getDashboardStats();
        return NextResponse.json(stats, { status: 200 });

      case 'content':
        const content = await getRecentContent();
        return NextResponse.json(content, { status: 200 });

      case 'popular':
        const popular = await getPopularContent();
        return NextResponse.json(popular, { status: 200 });

      case 'growth':
        const growth = await getGrowthStats();
        return NextResponse.json(growth, { status: 200 });

      case 'ratings':
        const ratings = await getRatingsStats();
        return NextResponse.json(ratings, { status: 200 });

      case 'cities':
        const cities = await getCityStats();
        return NextResponse.json(cities, { status: 200 });

      case 'categories':
        const categories = await getCategoryStats();
        return NextResponse.json(categories, { status: 200 });

      case 'all':
      default:
        // Obtener todas las estadísticas en paralelo
        const [
          allStats,
          allContent,
          allPopular,
          allGrowth,
          allRatings,
          allCities,
          allCategories,
        ] = await Promise.all([
          getDashboardStats(),
          getRecentContent(),
          getPopularContent(),
          getGrowthStats(),
          getRatingsStats(),
          getCityStats(),
          getCategoryStats(),
        ]);

        return NextResponse.json(
          {
            overview: allStats,
            content: allContent,
            popular: allPopular,
            growth: allGrowth,
            ratings: allRatings,
            cities: allCities,
            categories: allCategories,
          },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);

    return NextResponse.json(
      {
        error: 'Error al obtener las estadísticas',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

