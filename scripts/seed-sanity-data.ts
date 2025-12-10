
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

const cities = [
  {
    _type: 'city',
    _id: 'city-madrid',
    title: 'Madrid',
    slug: { _type: 'slug', current: 'madrid' },
    description: 'Capital gastronómica con una oferta inigualable.',
    region: 'Comunidad de Madrid',
    geo: { lat: 40.4168, lng: -3.7038 },
  },
  {
    _type: 'city',
    _id: 'city-barcelona',
    title: 'Barcelona',
    slug: { _type: 'slug', current: 'barcelona' },
    description: 'Tradición catalana e innovación culinaria.',
    region: 'Cataluña',
    geo: { lat: 41.3851, lng: 2.1734 },
  },
  {
    _type: 'city',
    _id: 'city-valencia',
    title: 'Valencia',
    slug: { _type: 'slug', current: 'valencia' },
    description: 'Cuna de la paella y la cocina mediterránea.',
    region: 'Comunidad Valenciana',
    geo: { lat: 39.4699, lng: -0.3763 },
  },
  {
    _type: 'city',
    _id: 'city-sevilla',
    title: 'Sevilla',
    slug: { _type: 'slug', current: 'sevilla' },
    description: 'Capital del tapeo andaluz.',
    region: 'Andalucía',
    geo: { lat: 37.3891, lng: -5.9845 },
  },
  {
    _type: 'city',
    _id: 'city-bilbao',
    title: 'Bilbao',
    slug: { _type: 'slug', current: 'bilbao' },
    description: 'Capital gastronómica vasca.',
    region: 'País Vasco',
    geo: { lat: 43.2630, lng: -2.9350 },
  },
  {
    _type: 'city',
    _id: 'city-granada',
    title: 'Granada',
    slug: { _type: 'slug', current: 'granada' },
    description: 'Fusión árabe-andaluza y tapas gratis.',
    region: 'Andalucía',
    geo: { lat: 37.1773, lng: -3.5986 },
  },
];

const categories = [
  {
    _type: 'category',
    _id: 'cat-espanola',
    title: 'Española Tradicional',
    slug: { _type: 'slug', current: 'espanola-tradicional' },
    description: 'Recetas centenarias y sabores auténticos.',
    icon: '🥘',
    color: 'red',
  },
  {
    _type: 'category',
    _id: 'cat-italiana',
    title: 'Italiana',
    slug: { _type: 'slug', current: 'italiana' },
    description: 'Pasta fresca, pizza artesanal y más.',
    icon: '🍝',
    color: 'green',
  },
  {
    _type: 'category',
    _id: 'cat-japonesa',
    title: 'Japonesa',
    slug: { _type: 'slug', current: 'japonesa' },
    description: 'Sushi, ramen y técnicas milenarias.',
    icon: '🍣',
    color: 'red',
  },
  {
    _type: 'category',
    _id: 'cat-cafeterias',
    title: 'Cafeterías',
    slug: { _type: 'slug', current: 'cafeterias' },
    description: 'Café de especialidad y repostería.',
    icon: '☕',
    color: 'brown',
  },
  {
    _type: 'category',
    _id: 'cat-tapas',
    title: 'Tapas y Pintxos',
    slug: { _type: 'slug', current: 'tapas-pintxos' },
    description: 'La esencia de la cultura gastronómica española.',
    icon: '🍷',
    color: 'orange',
  },
  {
    _type: 'category',
    _id: 'cat-alta-cocina',
    title: 'Alta Cocina',
    slug: { _type: 'slug', current: 'alta-cocina' },
    description: 'Estrellas Michelin y vanguardia.',
    icon: '⭐',
    color: 'gold',
  },
  {
    _type: 'category',
    _id: 'cat-asiatica',
    title: 'Asiática',
    slug: { _type: 'slug', current: 'asiatica' },
    description: 'Sabores de China, Tailandia, Vietnam y más.',
    icon: '🍜',
    color: 'purple',
  },
  {
    _type: 'category',
    _id: 'cat-vegetariana',
    title: 'Vegetariana/Vegana',
    slug: { _type: 'slug', current: 'vegetariana-vegana' },
    description: 'Cocina basada en plantas e ingredientes orgánicos.',
    icon: '🥗',
    color: 'green',
  },
];

const venues = [
  {
    _type: 'venue',
    _id: 'venue-casa-botin',
    title: 'Casa Botín',
    slug: { _type: 'slug', current: 'casa-botin' },
    description: 'El restaurante más antiguo del mundo según el Libro Guinness de los Récords.',
    address: 'Calle Cuchilleros, 17, 28005 Madrid',
    phone: '+34 91 366 42 17',
    website: 'https://botin.es',
    priceRange: '€€€',
    city: { _type: 'reference', _ref: 'city-madrid' },
    categories: [{ _type: 'reference', _ref: 'cat-espanola' }],
    geo: { lat: 40.4150, lng: -3.7074 },
  },
  {
    _type: 'venue',
    _id: 'venue-diverxo',
    title: 'DiverXO',
    slug: { _type: 'slug', current: 'diverxo' },
    description: 'Cocina fusión vanguardista con 3 estrellas Michelin de Dabiz Muñoz.',
    address: 'Calle del Padre Damián, 23, 28036 Madrid',
    phone: '+34 91 570 07 66',
    website: 'https://diverxo.com',
    priceRange: '€€€€',
    city: { _type: 'reference', _ref: 'city-madrid' },
    categories: [{ _type: 'reference', _ref: 'cat-alta-cocina' }],
    geo: { lat: 40.4584, lng: -3.6857 },
  },
  {
    _type: 'venue',
    _id: 'venue-casa-mingo',
    title: 'Casa Mingo',
    slug: { _type: 'slug', current: 'casa-mingo' },
    description: 'Sidrería asturiana centenaria famosa por su pollo asado.',
    address: 'Paseo de la Florida, 34, 28008 Madrid',
    phone: '+34 91 547 79 18',
    website: 'https://casamingo.es',
    priceRange: '€€',
    city: { _type: 'reference', _ref: 'city-madrid' },
    categories: [{ _type: 'reference', _ref: 'cat-espanola' }],
    geo: { lat: 40.4256, lng: -3.7265 },
  },
  {
    _type: 'venue',
    _id: 'venue-lateral-castellana',
    title: 'Lateral Castellana',
    slug: { _type: 'slug', current: 'lateral-castellana' },
    description: 'Tapas modernas en un ambiente cosmopolita.',
    address: 'Paseo de la Castellana, 42, 28046 Madrid',
    phone: '+34 91 575 25 53',
    website: 'https://lateral.com',
    priceRange: '€€',
    city: { _type: 'reference', _ref: 'city-madrid' },
    categories: [{ _type: 'reference', _ref: 'cat-tapas' }],
    geo: { lat: 40.4314, lng: -3.6876 },
  },
  {
    _type: 'venue',
    _id: 'venue-disfrutar',
    title: 'Disfrutar',
    slug: { _type: 'slug', current: 'disfrutar' },
    description: 'Vanguardia gastronómica y creatividad extrema.',
    address: 'Carrer de Villarroel, 163, 08036 Barcelona',
    phone: '+34 93 348 68 96',
    website: 'https://disfrutarbarcelona.com',
    priceRange: '€€€€',
    city: { _type: 'reference', _ref: 'city-barcelona' },
    categories: [{ _type: 'reference', _ref: 'cat-alta-cocina' }],
    geo: { lat: 41.3879, lng: 2.1531 },
  },
  {
    _type: 'venue',
    _id: 'venue-cal-pep',
    title: 'Cal Pep',
    slug: { _type: 'slug', current: 'cal-pep' },
    description: 'Legendario bar de tapas en El Born.',
    address: 'Plaça de les Olles, 8, 08003 Barcelona',
    phone: '+34 93 310 79 61',
    website: 'https://calpep.com',
    priceRange: '€€€',
    city: { _type: 'reference', _ref: 'city-barcelona' },
    categories: [{ _type: 'reference', _ref: 'cat-tapas' }],
    geo: { lat: 41.3834, lng: 2.1822 },
  },
  {
    _type: 'venue',
    _id: 'venue-pakta',
    title: 'Pakta',
    slug: { _type: 'slug', current: 'pakta' },
    description: 'Fusión japonesa-peruana de alta calidad.',
    address: 'Carrer de Lleida, 5, 08004 Barcelona',
    phone: '+34 93 624 01 77',
    website: 'https://elbarri.com/restaurant/pakta',
    priceRange: '€€€€',
    city: { _type: 'reference', _ref: 'city-barcelona' },
    categories: [{ _type: 'reference', _ref: 'cat-japonesa' }],
    geo: { lat: 41.3728, lng: 2.1567 },
  },
  {
    _type: 'venue',
    _id: 'venue-casa-roberto',
    title: 'Casa Roberto',
    slug: { _type: 'slug', current: 'casa-roberto' },
    description: 'Paella valenciana auténtica desde 1986.',
    address: 'Carrer del Mestre Gozalbo, 19, 46005 València',
    phone: '+34 96 395 15 28',
    website: 'https://casaroberto.es',
    priceRange: '€€€',
    city: { _type: 'reference', _ref: 'city-valencia' },
    categories: [{ _type: 'reference', _ref: 'cat-espanola' }],
    geo: { lat: 39.4654, lng: -0.3678 },
  },
  {
    _type: 'venue',
    _id: 'venue-ricard-camarena',
    title: 'Ricard Camarena Restaurant',
    slug: { _type: 'slug', current: 'ricard-camarena' },
    description: 'Cocina valenciana moderna con productos de proximidad.',
    address: 'Av. de Burjassot, 54, 46009 València',
    phone: '+34 96 335 54 18',
    website: 'https://ricardcamarena.com',
    priceRange: '€€€€',
    city: { _type: 'reference', _ref: 'city-valencia' },
    categories: [{ _type: 'reference', _ref: 'cat-alta-cocina' }],
    geo: { lat: 39.4856, lng: -0.3892 },
  },
  {
    _type: 'venue',
    _id: 'venue-eslava',
    title: 'Eslava',
    slug: { _type: 'slug', current: 'eslava' },
    description: 'Revolución del tapeo sevillano.',
    address: 'Calle Eslava, 3, 41002 Sevilla',
    phone: '+34 95 490 65 68',
    website: 'https://espacioeslava.com',
    priceRange: '€€',
    city: { _type: 'reference', _ref: 'city-sevilla' },
    categories: [{ _type: 'reference', _ref: 'cat-tapas' }],
    geo: { lat: 37.3994, lng: -5.9967 },
  },
  {
    _type: 'venue',
    _id: 'venue-azurmendi',
    title: 'Azurmendi',
    slug: { _type: 'slug', current: 'azurmendi' },
    description: '3 estrellas Michelin sostenible.',
    address: 'Barrio Legina, s/n, 48195 Larrabetzu, Bizkaia',
    phone: '+34 94 455 83 59',
    website: 'https://azurmendi.restaurant',
    priceRange: '€€€€',
    city: { _type: 'reference', _ref: 'city-bilbao' },
    categories: [{ _type: 'reference', _ref: 'cat-alta-cocina' }],
    geo: { lat: 43.2704, lng: -2.8325 },
  },
];

async function seedData() {
  console.log('Starting data seed...');

  // Seed Cities
  console.log('Seeding cities...');
  const cityTransaction = client.transaction();
  cities.forEach(city => {
    cityTransaction.createOrReplace(city);
  });
  await cityTransaction.commit();
  console.log('Cities seeded.');

  // Seed Categories
  console.log('Seeding categories...');
  const categoryTransaction = client.transaction();
  categories.forEach(category => {
    categoryTransaction.createOrReplace(category);
  });
  await categoryTransaction.commit();
  console.log('Categories seeded.');

  // Seed Venues
  console.log('Seeding venues...');
  const venueTransaction = client.transaction();
  venues.forEach(venue => {
    venueTransaction.createOrReplace(venue);
  });
  await venueTransaction.commit();
  console.log('Venues seeded.');

  console.log('Data seed completed successfully.');
}

seedData().catch(err => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
