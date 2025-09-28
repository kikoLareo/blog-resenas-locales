import { createClient } from '@sanity/client';

// Usar variables con fallbacks apropiados (priorizar NEXT_PUBLIC_ para compatibilidad cliente/servidor)
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2024-01-01';
const readToken = process.env.SANITY_API_READ_TOKEN || '';
const writeToken = process.env.SANITY_API_WRITE_TOKEN || '';

export const adminSanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: readToken,
  useCdn: false, // Siempre datos frescos para el admin
});

// Cliente con permisos de escritura para operaciones de admin
export const adminSanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken,
  useCdn: false,
});
