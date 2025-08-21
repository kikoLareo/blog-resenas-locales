import { createClient, type ClientConfig } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Tags estándar que usamos para revalidación ISR
export const REVALIDATE_TAGS = {
  venue: 'venues',
  review: 'reviews',
  post: 'posts',
  city: 'cities',
  category: 'categories',
} as const;

function getClientConfig(): ClientConfig | null {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset) return null;
  return {
    projectId,
    dataset,
    apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.SANITY_API_READ_TOKEN,
    perspective: 'published',
  } as const;
}

function getClientInstance() {
  const config = getClientConfig();
  return config ? createClient(config) : null;
}

export function urlFor(source: SanityImageSource) {
  const client = getClientInstance();
  if (!client) {
    throw new Error('Sanity client not configured: set SANITY_PROJECT_ID and SANITY_DATASET');
  }
  return imageUrlBuilder(client).image(source);
}

// Cliente para el lado del servidor con cache (fail-safe sin envs)
const realClient = getClientInstance();
export const client = realClient ?? ({
  fetch: async () => [] as unknown,
} as unknown as ReturnType<typeof createClient>);

// Cliente para preview mode (sin cache) (fail-safe)
const realPreviewClient = getClientConfig()
  ? createClient({
      ...(getClientConfig() as ClientConfig),
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN,
    })
  : null;

export const previewClient = realPreviewClient ?? ({
  fetch: async () => [] as unknown,
} as unknown as ReturnType<typeof createClient>);

// Helper para obtener el cliente correcto según el contexto
export const getClient = (preview?: boolean) => {
  return preview ? previewClient : client;
};

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

// Cached client for ISR
export async function sanityFetch<T = unknown>({
  query,
  params = {},
  tags = [],
  revalidate = 3600,
  preview = false,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number | false;
  preview?: boolean;
}): Promise<T> {
  const clientInstance = getClient(preview);

  return clientInstance.fetch(query, params, {
    next: {
      revalidate: preview ? 0 : revalidate,
      tags: preview ? [] : tags,
    },
  });
}

// Client for real-time preview (mantenido para compatibilidad)
export async function sanityPreviewFetch<T = unknown>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<T> {
  return sanityFetch<T>({
    query,
    params,
    preview: true,
  });
}