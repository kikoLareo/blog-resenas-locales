import { createClient, type ClientConfig } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

function getClientConfig(): ClientConfig | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;
  return {
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
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
    throw new Error('Sanity client not configured: set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET');
  }
  return imageUrlBuilder(client).image(source);
}

// Cached client for ISR
export async function sanityFetch<T = unknown>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  const client = getClientInstance();
  if (!client) {
    // No Sanity configured; return empty result to keep build working
    return [] as unknown as T;
  }
  return client.fetch(query, params, {
    next: {
      revalidate: false,
      tags,
    },
  });
}

// Client for real-time preview
function getPreviewClientInstance() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
    perspective: 'previewDrafts',
  });
}

export async function sanityPreviewFetch<T = unknown>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<T> {
  const previewClient = getPreviewClientInstance();
  if (!previewClient) {
    return [] as unknown as T;
  }
  return previewClient.fetch(query, params);
}