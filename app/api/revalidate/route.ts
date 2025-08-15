import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      _id: string;
      slug?: { current: string };
      venue?: { _ref: string };
    }>(req, process.env.SANITY_WEBHOOK_SECRET);

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
    }

    // Revalidar por tipo de contenido
    revalidateTag('content');
    revalidateTag(body._type);

    // Revalidaciones específicas por tipo
    switch (body._type) {
      case 'venue':
        revalidateTag('venues');
        revalidateTag('sitemap-venues');
        if (body.slug?.current) {
          revalidatePath(`/sitemap-venues.xml`);
        }
        break;

      case 'review':
        revalidateTag('reviews');
        revalidateTag('sitemap-reviews');
        revalidatePath('/');
        if (body.venue?._ref) {
          revalidateTag(`venue-${body.venue._ref}`);
        }
        break;

      case 'post':
        revalidateTag('posts');
        revalidateTag('sitemap-posts');
        revalidatePath('/blog');
        break;

      case 'city':
        revalidateTag('cities');
        revalidatePath('/');
        break;

      case 'category':
        revalidateTag('categories');
        revalidatePath('/');
        break;
    }

    // Revalidar sitemaps principales
    revalidatePath('/sitemap.xml');

    // eslint-disable-next-line no-console
    console.log(`✅ Revalidated: ${body._type} - ${body._id}`);

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      id: body._id,
      now: Date.now(),
    });
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('❌ Revalidation error:', err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}