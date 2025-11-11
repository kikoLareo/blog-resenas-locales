import { NextRequest, NextResponse } from 'next/server';
import { sanityFetch } from '@/lib/sanity.client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryType = searchParams.get('type') || 'cal-pep';
    
    let query = '';
    let params = {};
    
    switch (queryType) {
      case 'cal-pep':
        query = `*[_type == "venue" && title match "Cal Pep*"] {
          _id,
          title,
          slug,
          "city": city-> {
            _id,
            title,
            slug
          }
        }`;
        break;
        
      case 'cal-pep-slug':
        query = `*[_type == "venue" && slug.current match "*cal-pep*"] {
          _id,
          title,
          slug,
          "city": city-> {
            _id,
            title,
            slug
          }
        }`;
        break;
        
      case 'barcelona-venues':
        query = `*[_type == "venue" && city->title == "Barcelona"][0...10] {
          _id,
          title,
          slug,
          "city": city-> {
            _id,
            title,
            slug
          }
        }`;
        break;
        
      case 'tapas-venues':
        query = `*[_type == "venue" && categories[0]->slug.current == "tapas-pintxos"] {
          _id,
          title,
          slug,
          "city": city-> {
            _id,
            title,
            slug
          }
        }`;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid query type' }, { status: 400 });
    }
    
    const result = await sanityFetch({ 
      query, 
      params, 
      tags: ['venues'], 
      revalidate: 0 
    });
    
    const results = Array.isArray(result) ? result : (result ? [result] : []);
    
    return NextResponse.json({
      queryType,
      query,
      resultsCount: results.length,
      results: results
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch data', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}