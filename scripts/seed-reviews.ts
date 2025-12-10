
import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN || "sk5pdI1X71JKsFKbiWMFyXEiG8mOeBpze9ZsQBfxHfVMmkZmzfE5ixogDmbesz7dg4bIAqHNkDst2tJq9bv7BhE1VwIG1sJ6PK3uZhYuW0MLsqtpxzQYNQl14bOwiV17ZEhhCx6XTNy3Yjje0ViA31DU31ibKfguaZQYzcBU0vE7Kp7ZMZ3D",
  useCdn: false,
  apiVersion: '2023-05-03',
});

const reviews = [
  {
    _type: 'review',
    _id: 'review-casa-botin-1',
    title: 'Cena inolvidable en el restaurante más antiguo',
    slug: { _type: 'slug', current: 'cena-inolvidable-casa-botin' },
    venue: { _type: 'reference', _ref: 'venue-casa-botin' },
    reviewType: 'gastronomy',
    visitDate: '2025-01-15',
    published: true,
    featured: true,
    publishedAt: '2025-01-20T12:00:00Z',
    ratings: {
      service: 9.5,
      ambience: 10,
      value: 8.5,
      food: 9.0,
    },
    excerpt: 'Una experiencia histórica comiendo el mejor cochinillo de Madrid.',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Visitar Casa Botín es como viajar en el tiempo. El ambiente es espectacular y el cochinillo asado hace honor a su fama.',
          },
        ],
      },
    ],
  },
  {
    _type: 'review',
    _id: 'review-diverxo-1',
    title: 'Una locura gastronómica en DiverXO',
    slug: { _type: 'slug', current: 'locura-gastronomica-diverxo' },
    venue: { _type: 'reference', _ref: 'venue-diverxo' },
    reviewType: 'gastronomy',
    visitDate: '2025-02-01',
    published: true,
    featured: true,
    publishedAt: '2025-02-05T10:00:00Z',
    ratings: {
      service: 10,
      ambience: 10,
      value: 9.0,
      food: 10,
    },
    excerpt: 'Dabiz Muñoz sigue sorprendiendo con cada plato. Una experiencia única en la vida.',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'No es solo comer, es un espectáculo. Cada pase del menú degustación es una obra de arte.',
          },
        ],
      },
    ],
  },
  {
    _type: 'review',
    _id: 'review-disfrutar-1',
    title: 'Creatividad pura en Barcelona',
    slug: { _type: 'slug', current: 'creatividad-pura-disfrutar' },
    venue: { _type: 'reference', _ref: 'venue-disfrutar' },
    reviewType: 'gastronomy',
    visitDate: '2025-01-28',
    published: true,
    featured: false,
    publishedAt: '2025-02-02T14:30:00Z',
    ratings: {
      service: 10,
      ambience: 9.5,
      value: 9.5,
      food: 10,
    },
    excerpt: 'Técnica y sabor se unen en uno de los mejores restaurantes del mundo.',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'El menú clásico es un recorrido por los platos más icónicos del restaurante. Imprescindible.',
          },
        ],
      },
    ],
  },
  {
    _type: 'review',
    _id: 'review-casa-roberto-1',
    title: 'La mejor paella de Valencia',
    slug: { _type: 'slug', current: 'mejor-paella-valencia-casa-roberto' },
    venue: { _type: 'reference', _ref: 'venue-casa-roberto' },
    reviewType: 'gastronomy',
    visitDate: '2025-03-10',
    published: true,
    featured: false,
    publishedAt: '2025-03-12T13:00:00Z',
    ratings: {
      service: 8.0,
      ambience: 7.5,
      value: 9.0,
      food: 9.5,
    },
    excerpt: 'Si buscas una paella auténtica, este es el lugar.',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Arroz en su punto perfecto, socarrat delicioso y un trato muy familiar.',
          },
        ],
      },
    ],
  },
];

async function seedReviews() {
  console.log('Starting reviews seed...');

  const transaction = client.transaction();
  reviews.forEach(review => {
    transaction.createOrReplace(review);
  });

  await transaction.commit();
  console.log('Reviews seeded successfully.');
}

seedReviews().catch(err => {
  console.error('Error seeding reviews:', err);
  process.exit(1);
});
