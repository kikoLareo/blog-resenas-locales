import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

if (!projectId || !dataset) {
  throw new Error('Missing Sanity project ID or dataset');
}

// Cliente para el lado del servidor con cache
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  // Cache configurado para ISR
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
});

// Cliente para preview mode (sin cache)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
});

// Helper para obtener el cliente correcto según el contexto
export const getClient = (preview?: boolean) => {
  return preview ? previewClient : client;
};

// Configuración de tags para ISR
export const REVALIDATE_TAGS = {
  venue: 'venue',
  review: 'review',
  city: 'city',
  category: 'category',
  post: 'post',
} as const;

// Helper para generar tags de revalidación
export const getRevalidateTags = (types: (keyof typeof REVALIDATE_TAGS)[]) => {
  return types.map(type => REVALIDATE_TAGS[type]);
};

// Configuración de cache por defecto
export const DEFAULT_CACHE_CONFIG = {
  next: { 
    revalidate: 3600, // 1 hora
    tags: ['sanity']
  }
};

// Helper para queries con cache optimizado
export async function sanityFetch<T>({
  query,
  params = {},
  tags = ['sanity'],
  revalidate = 3600,
  preview = false,
}: {
  query: string;
  params?: Record<string, any>;
  tags?: string[];
  revalidate?: number | false;
  preview?: boolean;
}): Promise<T> {
  const client = getClient(preview);
  
  return client.fetch<T>(query, params, {
    next: {
      revalidate: preview ? 0 : revalidate,
      tags: preview ? [] : tags,
    },
  });
}