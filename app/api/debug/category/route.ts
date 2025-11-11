import { NextRequest, NextResponse } from 'next/server';
import { sanityFetch } from '@/lib/sanity.client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug') || 'tapas-pintxos';
    
    // Test the category query
    const categoryQuery = `
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
    
    const category = await sanityFetch<any>({ 
      query: categoryQuery, 
      params: { categorySlug: slug }, 
      tags: ['categories'], 
      revalidate: 0 
    });
    
    return NextResponse.json({
      slug,
      query: categoryQuery,
      category,
      success: true
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}