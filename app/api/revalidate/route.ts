import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { REVALIDATE_TAGS } from '@/lib/sanity.client';
import { submitToIndexNow, buildAbsoluteUrls } from '@/lib/indexnow';
import { SITE_CONFIG } from '@/lib/constants';

// Tipos para el webhook de Sanity
interface SanityWebhookPayload {
  _type: string;
  _id: string;
  slug?: {
    current: string;
  };
  city?: {
    slug: {
      current: string;
    };
  };
  venue?: {
    _ref?: string;
    slug?: {
      current: string;
    };
    city?: {
      slug: {
        current: string;
      };
    };
  };
}

// Generar paths para revalidación
function generateRevalidationPaths(payload: SanityWebhookPayload): string[] {
  const paths: string[] = [];
  
  switch (payload._type) {
    case 'venue':
      if (payload.slug?.current && payload.city?.slug?.current) {
        paths.push(`/${payload.city.slug.current}/${payload.slug.current}`);
        paths.push(`/${payload.city.slug.current}`);
      }
      break;
      
    case 'review':
      if (payload.venue?.slug?.current && payload.venue?.city?.slug?.current && payload.slug?.current) {
        paths.push(`/${payload.venue.city.slug.current}/${payload.venue.slug.current}/review/${payload.slug.current}`);
        paths.push(`/${payload.venue.city.slug.current}/${payload.venue.slug.current}`);
        paths.push(`/${payload.venue.city.slug.current}`);
      }
      break;
      
    case 'city':
      if (payload.slug?.current) {
        paths.push(`/${payload.slug.current}`);
      }
      break;
      
    case 'category':
      if (payload.slug?.current) {
        paths.push(`/categorias/${payload.slug.current}`);
      }
      break;

    case 'post':
      paths.push('/blog');
      break;
  }
  
  // Siempre revalidar homepage
  paths.push('/');
  
  return [...new Set(paths)]; // Eliminar duplicados
}

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<SanityWebhookPayload>(
      req, 
      process.env.SANITY_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      // eslint-disable-next-line no-console
      console.error('Webhook no autorizado - firma inválida');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
    }

    // eslint-disable-next-line no-console
    console.log('Webhook recibido:', {
      type: body._type,
      id: body._id,
      slug: body.slug?.current,
    });

    // Revalidar por tags usando REVALIDATE_TAGS
    revalidateTag('content');
    revalidateTag('sanity');
    
    const tagToRevalidate = REVALIDATE_TAGS[body._type as keyof typeof REVALIDATE_TAGS];
    if (tagToRevalidate) {
      revalidateTag(tagToRevalidate);
      // eslint-disable-next-line no-console
      console.log(`Tag revalidado: ${tagToRevalidate}`);
    }

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
        if (body.venue?._ref) {
          revalidateTag(`venue-${body.venue._ref}`);
        }
        break;

      case 'post':
        revalidateTag('posts');
        revalidateTag('sitemap-posts');
        break;

      case 'city':
        revalidateTag('cities');
        break;

      case 'category':
        revalidateTag('categories');
        break;
    }

    // Revalidar paths específicos
    const pathsToRevalidate = generateRevalidationPaths(body);
    const revalidationResults = pathsToRevalidate.map((path) => {
      try {
        revalidatePath(path);
        // eslint-disable-next-line no-console
        console.log(`Path revalidado: ${path}`);
        return { path, success: true };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error revalidando path ${path}:`, error);
        return { path, success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    });

    // Revalidar sitemaps principales
    try {
      revalidatePath('/sitemap.xml');
      revalidatePath('/api/sitemap');
      // eslint-disable-next-line no-console
      console.log('Sitemap revalidado');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error revalidando sitemap:', error);
    }

    // eslint-disable-next-line no-console
    console.log(`✅ Revalidated: ${body._type} - ${body._id}`);

    // IndexNow integration - enviar URLs actualizadas sin bloquear la respuesta
    let indexnowSubmitted = 0;
    try {
      const absoluteUrls = buildAbsoluteUrls(pathsToRevalidate, SITE_CONFIG.url);
      // No usar await para no bloquear la respuesta
      submitToIndexNow(absoluteUrls)
        .then((count) => {
          if (count > 0) {
            // eslint-disable-next-line no-console
            console.log(`IndexNow: ${count} URLs enviadas exitosamente`);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('IndexNow: Error en envío asíncrono:', error);
        });
      indexnowSubmitted = absoluteUrls.length;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('IndexNow: Error preparando URLs:', error);
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      type: body._type,
      id: body._id,
      tag: tagToRevalidate,
      paths: revalidationResults,
      indexnowSubmitted,
      now: Date.now(),
      timestamp: new Date().toISOString(),
    });

  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('❌ Revalidation error:', err);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Método GET para verificar que la API está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'API de revalidación ISR activa',
    timestamp: new Date().toISOString(),
    tags: Object.values(REVALIDATE_TAGS),
  });
}

// Configuración de runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
