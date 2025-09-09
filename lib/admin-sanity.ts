import { createClient } from '@sanity/client';

// Valores por defecto para desarrollo
const projectId = process.env.SANITY_PROJECT_ID || 'demo-project';
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2024-01-01';
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
