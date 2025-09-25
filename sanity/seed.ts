// Seed de contenido en Sanity usando el token de usuario del CLI
// Ejecutar con: npx sanity exec sanity/seed.ts --with-user-token

import { createClient } from '@sanity/client';

function required(name: string, v: string | undefined) {
  if (!v) throw new Error(`Falta env ${name}`);
  return v;
}

const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
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

async function uploadImageFromUrl(url: string, filename?: string) {
  const fallback = `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/1200/800`;
  const candidates = [
    // Añadir parámetros comunes para Unsplash
    url.includes('images.unsplash.com') ? `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&w=1200&q=80` : url,
    fallback,
  ];

  for (const u of candidates) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'sanity-seed-script' } });
      if (!res.ok) continue;
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const name = filename || u.split('?')[0].split('/').pop() || 'image.jpg';
      const asset = await client.assets.upload('image', buffer, { filename: name });
      return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } as const;
    } catch (_) {
      // intentar siguiente candidato
    }
  }
  throw new Error(`No se pudo descargar imagen: ${url}`);
}

async function ref(id: string) {
  return { _type: 'reference', _ref: id } as const;
}

async function run() {
  // ====== CATEGORÍAS ======
  const catPizza = await upsert({ _type: 'category', _id: 'cat-pizza', title: 'Pizza artesanal', slug: { current: 'pizza-artesanal' }, featured: true });
  const catSushi = await upsert({ _type: 'category', _id: 'cat-sushi', title: 'Sushi japonés', slug: { current: 'sushi-japones' }, featured: true });
  const catCafe  = await upsert({ _type: 'category', _id: 'cat-cafe',  title: 'Café y Brunch', slug: { current: 'cafe-brunch' } });

  // ====== CIUDADES ======
  const heroMadrid = await uploadImageFromUrl('https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=1200');
  const heroBarcelona = await uploadImageFromUrl('https://images.unsplash.com/photo-1473959383410-a621ab72b721?w=1200');
  const heroValencia = await uploadImageFromUrl('https://images.unsplash.com/photo-1591636519338-6e8f5f9465cb?w=1200');

  const cityMadrid = await upsert({ _type: 'city', _id: 'city-madrid', title: 'Madrid', slug: { current: 'madrid' }, region: 'Madrid', heroImage: heroMadrid });
  const cityBarcelona = await upsert({ _type: 'city', _id: 'city-barcelona', title: 'Barcelona', slug: { current: 'barcelona' }, region: 'Cataluña', heroImage: heroBarcelona });
  const cityValencia = await upsert({ _type: 'city', _id: 'city-valencia', title: 'Valencia', slug: { current: 'valencia' }, region: 'Comunidad Valenciana', heroImage: heroValencia });

  // ====== VENUES + IMÁGENES ======
  // Madrid - Pizza
  const mPizza1Img1 = await uploadImageFromUrl('https://images.unsplash.com/photo-1564936281404-cd77f0fb0b82?w=1200');
  const mPizza1Img2 = await uploadImageFromUrl('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200');
  const venueMadridPizza = await upsert({
    _type: 'venue',
    _id: 'venue-madrid-pizzeria-tradizionale',
    title: 'Pizzería Tradizionale',
    slug: { current: 'pizzeria-tradizionale' },
    city: await ref(cityMadrid),
    address: 'Calle Arenal 12, Madrid',
    priceRange: '€€',
    schemaType: 'Restaurant',
    images: [mPizza1Img1, mPizza1Img2],
    categories: [await ref(catPizza)],
  });

  // Madrid - Café
  const mCafe1Img1 = await uploadImageFromUrl('https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=1200');
  const venueMadridCafe = await upsert({
    _type: 'venue',
    _id: 'venue-madrid-cafe-encanto',
    title: 'Café con Encanto',
    slug: { current: 'cafe-con-encanto' },
    city: await ref(cityMadrid),
    address: 'Plaza Mayor 3, Madrid',
    priceRange: '€',
    schemaType: 'CafeOrCoffeeShop',
    images: [mCafe1Img1],
    categories: [await ref(catCafe)],
  });

  // Barcelona - Sushi
  const bSushi1Img1 = await uploadImageFromUrl('https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200');
  const bSushi1Img2 = await uploadImageFromUrl('https://images.unsplash.com/photo-1518552718880-9f5663ad6a4e?w=1200');
  const venueBarcelonaSushi = await upsert({
    _type: 'venue',
    _id: 'venue-barcelona-sushi-ikigai',
    title: 'Sushi Ikigai',
    slug: { current: 'sushi-ikigai' },
    city: await ref(cityBarcelona),
    address: 'Carrer de Mallorca 240, Barcelona',
    priceRange: '€€€',
    schemaType: 'Restaurant',
    images: [bSushi1Img1, bSushi1Img2],
    categories: [await ref(catSushi)],
  });

  // Valencia - Paella (como Restaurant general)
  const vRest1Img1 = await uploadImageFromUrl('https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200');
  const venueValenciaPaella = await upsert({
    _type: 'venue',
    _id: 'venue-valencia-casa-paella',
    title: 'Casa de la Paella',
    slug: { current: 'casa-de-la-paella' },
    city: await ref(cityValencia),
    address: 'Carrer de la Pau 10, Valencia',
    priceRange: '€€',
    schemaType: 'Restaurant',
    images: [vRest1Img1],
    categories: [],
  });

  // ====== REVIEWS ======
  const nowIso = new Date().toISOString();
  await upsert({
    _type: 'review',
    _id: 'review-pizzeria-tradizionale-masa-48h',
    title: 'La pizza de masa madre con 48h de fermentación',
    slug: { current: 'pizza-masa-madre-48h-madrid' },
    venue: await ref(venueMadridPizza),
    visitDate: '2025-08-01',
    publishedAt: nowIso,
    ratings: { food: 9, service: 8, ambience: 8, value: 9 },
    avgTicket: 18,
    pros: ['Masa con gran alveolado', 'Ingredientes DOP'],
    cons: ['Sala algo ruidosa'],
    tldr: 'Pizzería napolitana con masa madre y buenos ingredientes; imprescindible la Margherita.',
    faq: [
      { question: '¿Hacen reservas?', answer: 'Aceptan reservas online y por teléfono.' },
    ],
    gallery: [mPizza1Img1, mPizza1Img2],
    author: 'Equipo',
    tags: ['Pizza', 'Napolitana', 'Madrid'],
  });

  await upsert({
    _type: 'review',
    _id: 'review-sushi-ikigai-omakase',
    title: 'Omakase en Sushi Ikigai: producto top y cortes precisos',
    slug: { current: 'omakase-sushi-ikigai-barcelona' },
    venue: await ref(venueBarcelonaSushi),
    visitDate: '2025-07-20',
    publishedAt: nowIso,
    ratings: { food: 9, service: 9, ambience: 8, value: 7 },
    avgTicket: 65,
    pros: ['Pescado muy fresco', 'Nigiris impecables'],
    cons: ['Precio alto'],
    tldr: 'Una experiencia omakase cuidada al detalle en el Eixample.',
    faq: [],
    gallery: [bSushi1Img1, bSushi1Img2],
    author: 'Equipo',
    tags: ['Sushi', 'Omakase', 'Barcelona'],
  });

  await upsert({
    _type: 'review',
    _id: 'review-cafe-encanto-brunch',
    title: 'Brunch de fin de semana en Café con Encanto',
    slug: { current: 'brunch-cafe-encanto-madrid' },
    venue: await ref(venueMadridCafe),
    visitDate: '2025-07-27',
    publishedAt: nowIso,
    ratings: { food: 8, service: 8, ambience: 9, value: 8 },
    avgTicket: 14,
    pros: ['Café de especialidad', 'Terraza agradable'],
    cons: ['Colas a media mañana'],
    tldr: 'Brunch sencillo pero bien resuelto con buen café en el centro.',
    faq: [],
    gallery: [mCafe1Img1],
    author: 'Equipo',
    tags: ['Café', 'Brunch', 'Madrid'],
  });

  // ====== POSTS ======
  const postHero1 = await uploadImageFromUrl('https://images.unsplash.com/photo-1559054971-0f36c4f2c8df?w=1200');
  await upsert({
    _type: 'post',
    _id: 'post-top-pizzerias-madrid',
    title: 'Top pizzerías de masa madre en Madrid',
    slug: { current: 'top-pizzerias-madrid' },
    excerpt: 'Nuestra selección de pizzerías artesanales con fermentaciones largas en la capital.',
    heroImage: postHero1,
    publishedAt: nowIso,
    featured: true,
    author: 'Redacción',
    tags: ['Pizza', 'Guía', 'Madrid'],
    body: [],
  });

  const postHero2 = await uploadImageFromUrl('https://images.unsplash.com/photo-1541542684-4a5b6a01028b?w=1200');
  await upsert({
    _type: 'post',
    _id: 'post-mejores-sushi-barcelona',
    title: 'Dónde comer sushi en Barcelona: 7 barras imprescindibles',
    slug: { current: 'mejores-sushi-barcelona' },
    excerpt: 'Barras tradicionales, omakases y restaurantes modernos para amantes del sushi.',
    heroImage: postHero2,
    publishedAt: nowIso,
    featured: true,
    author: 'Redacción',
    tags: ['Sushi', 'Barcelona', 'Guía'],
    body: [],
  });

  // eslint-disable-next-line no-console
  console.log('✅ Seed completado con ciudades, categorías, locales, reseñas y posts (con imágenes).');
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


