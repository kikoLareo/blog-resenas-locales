import { NextRequest, NextResponse } from 'next/server';
import { adminSanityClient } from '@/lib/admin-sanity';
import type { ContentType, AvailableItem } from '@/types/homepage';

/**
 * GET /api/admin/content/[type]
 * Obtiene lista de items disponibles desde Sanity
 * Query params: search (opcional), page, pageSize
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const contentType = type as ContentType;
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    
    // Validar tipo de contenido
    const validTypes: ContentType[] = ['venue', 'review', 'category', 'city'];
    if (!validTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Query según tipo de contenido
    let query = '';
    let items: AvailableItem[] = [];

    switch (contentType) {
      case 'venue':
        query = `*[_type == "venue" ${search ? `&& title match "${search}*"` : ''}] | order(title asc) {
          _id,
          title,
          "slug": slug.current,
          "imageUrl": images[0].asset->url,
          "city": city->title,
          "category": categories[0]->title
        }`;
        break;

      case 'review':
        query = `*[_type == "review" ${search ? `&& title match "${search}*"` : ''}] | order(title asc) {
          _id,
          title,
          "slug": slug.current,
          "imageUrl": heroImage.asset->url,
          "venue": venue->title,
          "city": venue->city->title
        }`;
        break;

      case 'category':
        query = `*[_type == "category" ${search ? `&& title match "${search}*"` : ''}] | order(title asc) {
          _id,
          title,
          "slug": slug.current,
          "imageUrl": image.asset->url
        }`;
        break;

      case 'city':
        query = `*[_type == "city" ${search ? `&& title match "${search}*"` : ''}] | order(title asc) {
          _id,
          title,
          "slug": slug.current,
          "imageUrl": heroImage.asset->url
        }`;
        break;
    }

    // Ejecutar query en Sanity
    const allItems = await adminSanityClient.fetch(query);
    
    // Mapear a formato AvailableItem
    items = allItems.map((item: any) => ({
      _id: item._id,
      title: item.title,
      slug: item.slug,
      imageUrl: item.imageUrl,
      type: contentType,
      city: item.city,
      venue: item.venue,
      category: item.category,
    }));

    // Paginación
    const total = items.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedItems = items.slice(start, end);
    const hasMore = end < total;

    return NextResponse.json({
      items: paginatedItems,
      total,
      page,
      pageSize,
      hasMore,
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
