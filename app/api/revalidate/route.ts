import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { REVALIDATE_TAGS } from '@/lib/sanity.client';

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
    slug: {
      current: string;
    };
    city: {
      slug: {
        current: string;
      };
    };
  };
}

// Verificar token de seguridad
function verifyWebhookSecret(request: NextRequest): boolean {
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('SANITY_WEBHOOK_SECRET no está configurado');
    return false;
  }

  const signature = request.headers.get('sanity-webhook-signature');
  const providedSecret = request.headers.get('sanity-webhook-secret');
  
  return providedSecret === webhookSecret || signature === webhookSecret;
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
        paths.push(`/${payload.venue.city.slug.current}/${payload.venue.slug.current}/${payload.slug.current}`);
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
  }
  
  // Siempre revalidar homepage
  paths.push('/');
  
  return [...new Set(paths)]; // Eliminar duplicados
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    if (!verifyWebhookSecret(request)) {
      console.error('Webhook no autorizado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Parsear payload
    const payload: SanityWebhookPayload = await request.json();
    
    console.log('Webhook recibido:', {
      type: payload._type,
      id: payload._id,
      slug: payload.slug?.current,
    });

    // Revalidar por tags
    const tagToRevalidate = REVALIDATE_TAGS[payload._type as keyof typeof REVALIDATE_TAGS];
    if (tagToRevalidate) {
      revalidateTag(tagToRevalidate);
      console.log(`Tag revalidado: ${tagToRevalidate}`);
    }

    // Revalidar tag general
    revalidateTag('sanity');

    // Revalidar paths específicos
    const pathsToRevalidate = generateRevalidationPaths(payload);
    const revalidationPromises = pathsToRevalidate.map(async (path) => {
      try {
        revalidatePath(path);
        console.log(`Path revalidado: ${path}`);
        return { path, success: true };
      } catch (error) {
        console.error(`Error revalidando path ${path}:`, error);
        return { path, success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    });

    const revalidationResults = await Promise.all(revalidationPromises);
    
    // Revalidar sitemap
    try {
      revalidatePath('/sitemap.xml');
      revalidatePath('/api/sitemap');
      console.log('Sitemap revalidado');
    } catch (error) {
      console.error('Error revalidando sitemap:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Revalidación completada',
      data: {
        type: payload._type,
        id: payload._id,
        tag: tagToRevalidate,
        paths: revalidationResults,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error en webhook de revalidación:', error);
    
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
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