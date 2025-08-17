// Seed de contenido en Sanity usando el token de usuario del CLI
// Ejecutar con: npx sanity exec sanity/seed.ts --with-user-token

import { createClient } from '@sanity/client';

function required(name: string, v: string | undefined) {
  if (!v) throw new Error(`Falta env ${name}`);
  return v;
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN;

const client = createClient({ projectId: required('projectId', projectId), dataset: required('dataset', dataset), apiVersion: '2024-01-01', token, useCdn: false });

async function upsert(doc: any) {
  const id = doc._id || undefined;
  if (id) {
    await client.createIfNotExists({ ...doc, _id: id });
    return id;
  }
  const created = await client.create(doc);
  return created._id as string;
}

async function run() {
  // 1) City
  const cityId = await upsert({
    _type: 'city',
    _id: 'city-madrid',
    title: 'Madrid',
    slug: { current: 'madrid' },
    region: 'Madrid',
  });

  // 2) Venue
  const venueId = await upsert({
    _type: 'venue',
    _id: 'venue-restaurant-x',
    title: 'Restaurant X',
    slug: { current: 'restaurant-x' },
    city: { _type: 'reference', _ref: cityId },
    address: 'Calle de la Gastronomía, 45, 28001 Madrid',
    priceRange: '€€',
    schemaType: 'Restaurant',
    images: [],
    categories: [],
  });

  // 3) Review
  const reviewSlug = 'experiencia-unica-en-el-restaurante-mas-moderno-de-la-ciudad';
  await upsert({
    _type: 'review',
    _id: 'review-restaurant-x-experiencia-unica',
    title: 'Experiencia única en el restaurante más moderno de la ciudad',
    slug: { current: reviewSlug },
    venue: { _type: 'reference', _ref: venueId },
    visitDate: '2025-08-01',
    publishedAt: new Date().toISOString(),
    ratings: { food: 9, service: 9, ambience: 9, value: 8 },
    avgTicket: 45,
    pros: ['Servicio impecable', 'Diseño vanguardista', 'Platos creativos'],
    cons: ['Precio elevado'],
    tldr: 'Restaurante moderno con cocina de autor, ideal para ocasiones especiales.',
    faq: [
      { question: '¿Necesito reserva?', answer: 'Sí, especialmente fines de semana.' },
      { question: '¿Tienen opciones vegetarianas?', answer: 'Sí, varias opciones en carta.' },
    ],
    gallery: [],
    author: 'María González',
    tags: ['Moderno', 'Fine Dining', 'Madrid'],
  });

  // eslint-disable-next-line no-console
  console.log('✅ Seed completado. Ciudad, local y reseña creados.');
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


