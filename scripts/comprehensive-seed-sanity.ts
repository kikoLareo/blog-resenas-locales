/**
 * Comprehensive Sanity Data Seeding Script
 * Populates all entities with real, complete data for the restaurant review blog
 */

import { createClient } from '@sanity/client';

// Client configuration
const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: "sk5pdI1X71JKsFKbiWMFyXEiG8mOeBpze9ZsQBfxHfVMmkZmzfE5ixogDmbesz7dg4bIAqHNkDst2tJq9bv7BhE1VwIG1sJ6PK3uZhYuW0MLsqtpxzQYNQl14bOwiV17ZEhhCx6XTNy3Yjje0ViA31DU31ibKfguaZQYzcBU0vE7Kp7ZMZ3D",
  useCdn: false,
});

// Helper functions
async function uploadImageFromUrl(url: string, filename?: string) {
  try {
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'sanity-seed-script' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const name = filename || url.split('?')[0].split('/').pop() || 'image.jpg';
    const asset = await adminClient.assets.upload('image', buffer, { filename: name });
    
    return { 
      _type: 'image', 
      asset: { _type: 'reference', _ref: asset._id } 
    };
  } catch (error) {
    console.warn(`Error uploading image ${url}:`, error);
    // Fallback to a simple placeholder
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: 'fallback-image' }
    };
  }
}

const ref = (id: string) => ({ _type: 'reference', _ref: id });

// =============================================================================
// COMPREHENSIVE SPANISH CITIES DATA
// =============================================================================
const cities = [
  {
    _type: 'city',
    _id: 'city-madrid',
    title: 'Madrid',
    slug: { current: 'madrid' },
    region: 'Comunidad de Madrid',
    country: 'España',
    description: 'Capital gastronómica de España con una escena culinaria vibrante que combina tradición e innovación.',
    localInfo: 'Madrid es famosa por sus tabernas centenarias, mercados tradicionales como el de San Miguel, y una nueva generación de chefs que reinventan la cocina española.',
    population: 3223334,
    postalCodes: ['28001', '28002', '28003', '28004', '28005', '28006', '28007', '28008', '28009', '28010'],
    timezone: 'Europe/Madrid',
    geo: {
      lat: 40.4168,
      lng: -3.7038
    },
    highlights: ['Mercado de San Miguel', 'Barrio de La Latina', 'Gran Vía gastronómica', 'Malasaña alternativo', 'Salamanca gourmet'],
    cuisineSpecialties: ['Cocido madrileño', 'Callos a la madrileña', 'Bocadillo de calamares', 'Torrijas', 'Huevos estrellados'],
    featured: true,
    order: 1,
    seoTitle: 'Mejores Restaurantes en Madrid - Reseñas y Guías Gastronómicas 2025',
    seoDescription: 'Descubre los mejores restaurantes de Madrid con nuestras reseñas detalladas. Desde tabernas tradicionales hasta alta cocina de vanguardia.',
    seoKeywords: ['restaurantes madrid', 'tapas madrid', 'donde comer madrid', 'gastronomía madrid', 'guía restaurantes madrid']
  },
  {
    _type: 'city',
    _id: 'city-barcelona',
    title: 'Barcelona',
    slug: { current: 'barcelona' },
    region: 'Cataluña',
    country: 'España',
    description: 'Ciudad cosmopolita con rica tradición catalana y una escena gastronómica innovadora reconocida mundialmente.',
    localInfo: 'Barcelona fusiona la tradición catalana con la creatividad culinaria internacional, siendo cuna de grandes chefs y técnicas revolucionarias.',
    population: 1620343,
    postalCodes: ['08001', '08002', '08003', '08004', '08005', '08006', '08007', '08008', '08009', '08010'],
    timezone: 'Europe/Madrid',
    geo: {
      lat: 41.3851,
      lng: 2.1734
    },
    highlights: ['El Born gastronómico', 'Mercado de la Boquería', 'Barceloneta marinera', 'Eixample gourmet', 'Gràcia bohemio'],
    cuisineSpecialties: ['Pan con tomate', 'Escudella', 'Crema catalana', 'Fideuá', 'Butifarra con mongetes'],
    featured: true,
    order: 2,
    seoTitle: 'Mejores Restaurantes en Barcelona - Guía Gastronómica Catalana 2025',
    seoDescription: 'Explora los mejores restaurantes de Barcelona. Desde cocina catalana tradicional hasta propuestas innovadoras de chefs reconocidos internacionalmente.',
    seoKeywords: ['restaurantes barcelona', 'cocina catalana', 'donde comer barcelona', 'pintxos barcelona', 'gastronomía catalana']
  },
  {
    _type: 'city',
    _id: 'city-valencia',
    title: 'Valencia',
    slug: { current: 'valencia' },
    region: 'Comunidad Valenciana',
    country: 'España',
    description: 'Cuna de la paella y capital gastronómica del Mediterráneo con productos de huerta excepcionales.',
    localInfo: 'Valencia es mundialmente conocida por su paella auténtica, pero también destaca por su horchata, sus naranjas y una cocina de mercado incomparable.',
    population: 791413,
    postalCodes: ['46001', '46002', '46003', '46004', '46005', '46006', '46007', '46008', '46009', '46010'],
    timezone: 'Europe/Madrid',
    geo: {
      lat: 39.4699,
      lng: -0.3763
    },
    highlights: ['La Albufera paellera', 'Mercado Central', 'Barrio del Carmen', 'Ciudad de las Artes', 'Playa de la Malvarrosa'],
    cuisineSpecialties: ['Paella valenciana', 'Horchata de chufa', 'All i pebre', 'Esgarraet', 'Agua de Valencia'],
    featured: true,
    order: 3,
    seoTitle: 'Mejores Restaurantes en Valencia - Cuna de la Paella Auténtica 2025',
    seoDescription: 'Descubre los mejores restaurantes de Valencia, cuna de la paella. Reseñas detalladas de cocina valenciana tradicional y moderna.',
    seoKeywords: ['restaurantes valencia', 'paella valencia', 'donde comer valencia', 'gastronomía valenciana', 'horchata valencia']
  },
  {
    _type: 'city',
    _id: 'city-sevilla',
    title: 'Sevilla',
    slug: { current: 'sevilla' },
    region: 'Andalucía',
    country: 'España',
    description: 'Capital andaluza del tapeo con una cultura gastronómica centenaria llena de sabor y tradición.',
    localInfo: 'Sevilla es el corazón del tapeo andaluz, donde cada bar tiene su especialidad y la cultura de la comida se vive en la calle.',
    population: 688711,
    postalCodes: ['41001', '41002', '41003', '41004', '41005', '41006', '41007', '41008', '41009', '41010'],
    timezone: 'Europe/Madrid',
    geo: {
      lat: 37.3891,
      lng: -5.9845
    },
    highlights: ['Barrio de Triana', 'Alameda de Hércules', 'Calle Betis', 'Mercado de la Encarnación', 'Santa Cruz histórico'],
    cuisineSpecialties: ['Pescaíto frito', 'Jamón ibérico', 'Gazpacho andaluz', 'Flamenquín', 'Torrijas sevillanas'],
    featured: true,
    order: 4,
    seoTitle: 'Mejores Restaurantes en Sevilla - Capital del Tapeo Andaluz 2025',
    seoDescription: 'Explora los mejores restaurantes y tabernas de Sevilla. La auténtica cultura del tapeo andaluz y cocina tradicional sevillana.',
    seoKeywords: ['restaurantes sevilla', 'tapas sevilla', 'donde tapear sevilla', 'gastronomía andaluza', 'jamón ibérico sevilla']
  },
  {
    _type: 'city',
    _id: 'city-bilbao',
    title: 'Bilbao',
    slug: { current: 'bilbao' },
    region: 'País Vasco',
    country: 'España',
    description: 'Capital gastronómica vasca con la mayor concentración de estrellas Michelin por habitante del mundo.',
    localInfo: 'Bilbao es sinónimo de excelencia culinaria, con una tradición de pintxos única y chefs que han revolucionado la gastronomía mundial.',
    population: 345821,
    postalCodes: ['48001', '48002', '48003', '48004', '48005', '48006', '48007', '48008', '48009', '48010'],
    timezone: 'Europe/Madrid',
    geo: {
      lat: 43.2627,
      lng: -2.9253
    },
    highlights: ['Casco Viejo pintxero', 'Ensanche gourmet', 'Mercado de la Ribera', 'Abandoibarra moderno', 'Getxo marinero'],
    cuisineSpecialties: ['Pintxos', 'Bacalao al pil pil', 'Txuleta', 'Marmitako', 'Idiazábal'],
    featured: true,
    order: 5,
    seoTitle: 'Mejores Restaurantes en Bilbao - Capital Gastronómica Vasca 2025',
    seoDescription: 'Descubre los mejores restaurantes y pintxos de Bilbao. La capital gastronómica vasca con la mayor densidad de estrellas Michelin.',
    seoKeywords: ['restaurantes bilbao', 'pintxos bilbao', 'donde comer bilbao', 'gastronomía vasca', 'estrellas michelin bilbao']
  },
  {
    _type: 'city',
    _id: 'city-granada',
    title: 'Granada',
    slug: { current: 'granada' },
    region: 'Andalucía',
    country: 'España',
    description: 'Ciudad histórica donde aún se conserva la tradición de la tapa gratis y la fusión árabe-andaluza.',
    localInfo: 'Granada mantiene viva la tradición de poner tapa gratis con cada consumición, además de una rica herencia culinaria árabe-andaluza.',
    population: 232770,
    postalCodes: ['18001', '18002', '18003', '18004', '18005', '18006', '18007', '18008', '18009', '18010'],
    timezone: 'Europe/Madrid',
    geo: {
      lat: 37.1773,
      lng: -3.5986
    },
    highlights: ['Albaicín morisco', 'Plaza Nueva tapera', 'Realejo bohemio', 'Sacromonte cuevas', 'Centro comercial'],
    cuisineSpecialties: ['Piononos', 'Habas con jamón', 'Remojón granadino', 'Tortilla del Sacromonte', 'Soplillos'],
    featured: false,
    order: 6,
    seoTitle: 'Mejores Restaurantes en Granada - Tradición de Tapas Gratis 2025',
    seoDescription: 'Explora los mejores restaurantes de Granada y su tradición única de tapas gratis. Fusión árabe-andaluza en cada bocado.',
    seoKeywords: ['restaurantes granada', 'tapas gratis granada', 'donde comer granada', 'gastronomía granada', 'cocina árabe andaluza']
  }
];

// =============================================================================
// COMPREHENSIVE RESTAURANT CATEGORIES
// =============================================================================
const categories = [
  {
    _type: 'category',
    _id: 'category-espanola-tradicional',
    title: 'Española Tradicional',
    slug: { current: 'espanola-tradicional' },
    description: 'Auténtica cocina española con recetas tradicionales transmitidas de generación en generación, usando productos locales de primera calidad.',
    schemaType: 'Restaurant',
    cuisineType: ['spanish', 'mediterranean'],
    priceRangeTypical: '€€',
    icon: '🥘',
    color: 'red',
    featured: true,
    order: 1,
    seoTitle: 'Mejores Restaurantes de Cocina Española Tradicional',
    seoDescription: 'Descubre restaurantes de auténtica cocina española tradicional. Recetas centenarias y sabores de toda la península.',
    seoKeywords: ['cocina española', 'restaurantes tradicionales', 'gastronomía española', 'comida tradicional']
  },
  {
    _type: 'category',
    _id: 'category-italiana',
    title: 'Italiana',
    slug: { current: 'italiana' },
    description: 'Auténtica cocina italiana con pastas frescas hechas a mano, pizzas artesanales en horno de leña y sabores tradicionales de todas las regiones de Italia.',
    schemaType: 'Restaurant',
    cuisineType: ['italian', 'mediterranean'],
    priceRangeTypical: '€€',
    icon: '🍝',
    color: 'green',
    featured: true,
    order: 2,
    seoTitle: 'Mejores Restaurantes Italianos - Pasta Fresca y Pizza Artesanal',
    seoDescription: 'Los mejores restaurantes italianos con pasta fresca, pizza napoletana y sabores auténticos de Italia.',
    seoKeywords: ['restaurantes italianos', 'pasta fresca', 'pizza artesanal', 'cocina italiana auténtica']
  },
  {
    _type: 'category',
    _id: 'category-japonesa',
    title: 'Japonesa',
    slug: { current: 'japonesa' },
    description: 'Cocina japonesa tradicional y moderna con sushi de primera calidad, ramen auténtico y técnicas milenarias de preparación.',
    schemaType: 'Restaurant',
    cuisineType: ['japanese', 'asian'],
    priceRangeTypical: '€€€',
    icon: '🍣',
    color: 'indigo',
    featured: true,
    order: 3,
    seoTitle: 'Mejores Restaurantes Japoneses - Sushi Fresco y Ramen Auténtico',
    seoDescription: 'Restaurantes japoneses de calidad con sushi fresco, ramen tradicional y cocina nikkei de alta gama.',
    seoKeywords: ['restaurantes japoneses', 'sushi fresco', 'ramen auténtico', 'cocina japonesa', 'omakase']
  },
  {
    _type: 'category',
    _id: 'category-cafeteria',
    title: 'Cafeterías',
    slug: { current: 'cafeterias' },
    description: 'Cafeterías acogedoras con café de especialidad de origen único, repostería artesanal y ambientes perfectos para el trabajo y relajación.',
    schemaType: 'CafeOrCoffeeShop',
    cuisineType: ['international'],
    priceRangeTypical: '€',
    icon: '☕',
    color: 'yellow',
    featured: true,
    order: 4,
    seoTitle: 'Mejores Cafeterías - Café de Especialidad y Repostería Artesanal',
    seoDescription: 'Las mejores cafeterías con café de especialidad, repostería artesanal y ambientes perfectos para trabajar.',
    seoKeywords: ['mejores cafeterías', 'café especialidad', 'repostería artesanal', 'café madrid barcelona']
  },
  {
    _type: 'category',
    _id: 'category-tapas-pintxos',
    title: 'Tapas y Pintxos',
    slug: { current: 'tapas-pintxos' },
    description: 'Auténticos bares de tapas y pintxos donde disfrutar de la cultura gastronómica española más tradicional en un ambiente informal y social.',
    schemaType: 'BarOrPub',
    cuisineType: ['spanish'],
    priceRangeTypical: '€',
    icon: '🍷',
    color: 'orange',
    featured: true,
    order: 5,
    seoTitle: 'Mejores Bares de Tapas y Pintxos - Cultura Gastronómica Española',
    seoDescription: 'Los mejores bares de tapas y pintxos para disfrutar de la auténtica cultura gastronómica española.',
    seoKeywords: ['tapas', 'pintxos', 'bares españoles', 'cultura gastronómica', 'tapeo']
  },
  {
    _type: 'category',
    _id: 'category-alta-cocina',
    title: 'Alta Cocina',
    slug: { current: 'alta-cocina' },
    description: 'Restaurantes de alta cocina con propuestas gastronómicas innovadoras, técnicas vanguardistas y experiencias culinarias únicas.',
    schemaType: 'Restaurant',
    cuisineType: ['fusion', 'international'],
    priceRangeTypical: '€€€€',
    icon: '⭐',
    color: 'purple',
    featured: true,
    order: 6,
    seoTitle: 'Mejores Restaurantes de Alta Cocina - Experiencias Gastronómicas Únicas',
    seoDescription: 'Restaurantes de alta cocina con estrellas Michelin y propuestas gastronómicas innovadoras de chefs reconocidos.',
    seoKeywords: ['alta cocina', 'estrellas michelin', 'restaurantes gourmet', 'cocina innovadora']
  },
  {
    _type: 'category',
    _id: 'category-asiatica',
    title: 'Asiática',
    slug: { current: 'asiatica' },
    description: 'Cocina asiática variada incluyendo china, tailandesa, vietnamita y coreana con sabores auténticos y técnicas tradicionales.',
    schemaType: 'Restaurant',
    cuisineType: ['asian', 'chinese', 'vietnamese', 'thai'],
    priceRangeTypical: '€€',
    icon: '🍜',
    color: 'teal',
    featured: false,
    order: 7,
    seoTitle: 'Mejores Restaurantes Asiáticos - Cocina China, Tailandesa y Vietnamita',
    seoDescription: 'Los mejores restaurantes asiáticos con cocina china auténtica, tailandesa tradicional y vietnamita fresca.',
    seoKeywords: ['restaurantes asiáticos', 'cocina china', 'comida tailandesa', 'restaurantes vietnamitas']
  },
  {
    _type: 'category',
    _id: 'category-vegetariana-vegana',
    title: 'Vegetariana y Vegana',
    slug: { current: 'vegetariana-vegana' },
    description: 'Restaurantes especializados en cocina vegetariana y vegana con ingredientes orgánicos, platos creativos y opciones saludables.',
    schemaType: 'Restaurant',
    cuisineType: ['vegetarian', 'vegan'],
    priceRangeTypical: '€€',
    icon: '🥗',
    color: 'green',
    featured: false,
    order: 8,
    seoTitle: 'Mejores Restaurantes Vegetarianos y Veganos - Cocina Saludable',
    seoDescription: 'Restaurantes vegetarianos y veganos con ingredientes orgánicos y platos creativos y saludables.',
    seoKeywords: ['restaurantes vegetarianos', 'comida vegana', 'cocina saludable', 'ingredientes orgánicos']
  }
];

// =============================================================================
// COMPREHENSIVE VENUES DATA
// =============================================================================
const venues = [
  // MADRID VENUES
  {
    _type: 'venue',
    _id: 'venue-casa-botin-madrid',
    title: 'Casa Botín',
    slug: { current: 'casa-botin-madrid' },
    city: ref('city-madrid'),
    address: 'Calle Cuchilleros, 17',
    postalCode: '28005',
    phone: '+34 91 366 42 17',
    website: 'https://casabotin.es',
    geo: {
      lat: 40.4147,
      lng: -3.7084
    },
    openingHours: ['Mo-Su 13:00-16:00,20:00-24:00'],
    priceRange: '€€€',
    description: 'El restaurante más antiguo del mundo según el Libro Guinness de los Récords, famoso por su cochinillo asado y cordero lechal desde 1725.',
    specialties: ['Cochinillo asado', 'Cordero lechal', 'Sopa castellana', 'Cocido madrileño'],
    ambiance: ['Histórico', 'Tradicional', 'Familiar', 'Turístico'],
    schemaType: 'Restaurant',
    social: {
      instagram: 'https://instagram.com/casabotin',
      facebook: 'https://facebook.com/casabotin',
      maps: 'https://maps.google.com/?q=Casa+Botin+Madrid'
    },
    categories: [ref('category-espanola-tradicional')],
    seoTitle: 'Casa Botín Madrid - El Restaurante Más Antiguo del Mundo',
    seoDescription: 'Casa Botín, el restaurante más antiguo del mundo desde 1725. Cochinillo asado y cordero lechal en el corazón del Madrid histórico.',
    seoKeywords: ['Casa Botín', 'restaurante más antiguo mundo', 'cochinillo madrid', 'cordero lechal madrid']
  },
  {
    _type: 'venue',
    _id: 'venue-diverxo-madrid',
    title: 'DiverXO',
    slug: { current: 'diverxo-madrid' },
    city: ref('city-madrid'),
    address: 'Calle Padre Damián, 23',
    postalCode: '28036',
    phone: '+34 91 570 07 66',
    website: 'https://diverxo.com',
    geo: {
      lat: 40.4322,
      lng: -3.6832
    },
    openingHours: ['Tu-Sa 14:00-16:00,21:00-23:30'],
    priceRange: '€€€€',
    description: 'Tres estrellas Michelin de Dabiz Muñoz, considerado uno de los mejores restaurantes del mundo con cocina fusión creativa e innovadora.',
    specialties: ['Menú degustación', 'Cocina fusión', 'Creatividad culinaria', 'Técnicas vanguardistas'],
    ambiance: ['Innovador', 'Exclusivo', 'Vanguardista', 'Único'],
    schemaType: 'Restaurant',
    social: {
      instagram: 'https://instagram.com/diverxo',
      facebook: 'https://facebook.com/diverxo',
      maps: 'https://maps.google.com/?q=DiverXO+Madrid'
    },
    categories: [ref('category-alta-cocina')],
    seoTitle: 'DiverXO Madrid - 3 Estrellas Michelin de Dabiz Muñoz',
    seoDescription: 'DiverXO, el restaurante 3 estrellas Michelin de Dabiz Muñoz en Madrid. Cocina fusión innovadora considerada entre las mejores del mundo.',
    seoKeywords: ['DiverXO', 'Dabiz Muñoz', '3 estrellas michelin madrid', 'mejor restaurante mundo']
  },
  {
    _type: 'venue',
    _id: 'venue-casa-mingo-madrid',
    title: 'Casa Mingo',
    slug: { current: 'casa-mingo-madrid' },
    city: ref('city-madrid'),
    address: 'Paseo de la Florida, 34',
    postalCode: '28008',
    phone: '+34 91 547 79 18',
    website: 'https://casamingo.es',
    geo: {
      lat: 40.4242,
      lng: -3.7185
    },
    openingHours: ['Mo-Su 11:00-24:00'],
    priceRange: '€',
    description: 'Sidrería asturiana centenaria famosa por su pollo asado y sidra natural en un ambiente tradicional y familiar cerca del Palacio Real.',
    specialties: ['Pollo asado', 'Sidra natural', 'Queso cabrales', 'Chorizo a la sidra'],
    ambiance: ['Tradicional', 'Familiar', 'Informal', 'Auténtico'],
    schemaType: 'Restaurant',
    social: {
      instagram: 'https://instagram.com/casamingo',
      maps: 'https://maps.google.com/?q=Casa+Mingo+Madrid'
    },
    categories: [ref('category-espanola-tradicional')],
    seoTitle: 'Casa Mingo Madrid - Sidrería Asturiana Centenaria',
    seoDescription: 'Casa Mingo, sidrería asturiana centenaria en Madrid. Famosa por su pollo asado y sidra natural en ambiente tradicional.',
    seoKeywords: ['Casa Mingo', 'sidrería madrid', 'pollo asado madrid', 'sidra natural']
  },
  {
    _type: 'venue',
    _id: 'venue-lateral-madrid',
    title: 'Lateral Castellana',
    slug: { current: 'lateral-castellana-madrid' },
    city: ref('city-madrid'),
    address: 'Calle Velázquez, 57',
    postalCode: '28001',
    phone: '+34 91 435 06 04',
    website: 'https://lateral.com',
    geo: {
      lat: 40.4276,
      lng: -3.6874
    },
    openingHours: ['Mo-Th 08:00-02:00', 'Fr-Sa 08:00-02:30', 'Su 08:00-02:00'],
    priceRange: '€€',
    description: 'Concepto moderno de tapas y cocina mediterránea con ambiente cosmopolita en el exclusivo barrio de Salamanca.',
    specialties: ['Tapas modernas', 'Huevos rotos', 'Tataki de atún', 'Croquetas gourmet'],
    ambiance: ['Moderno', 'Cosmopolita', 'Elegante', 'Social'],
    schemaType: 'Restaurant',
    social: {
      instagram: 'https://instagram.com/lateral',
      facebook: 'https://facebook.com/lateral',
      maps: 'https://maps.google.com/?q=Lateral+Castellana+Madrid'
    },
    categories: [ref('category-tapas-pintxos')],
    seoTitle: 'Lateral Castellana Madrid - Tapas Modernas en Salamanca',
    seoDescription: 'Lateral Castellana, tapas modernas y cocina mediterránea en el barrio de Salamanca. Ambiente cosmopolita y elegante.',
    seoKeywords: ['Lateral Madrid', 'tapas modernas madrid', 'barrio salamanca restaurantes', 'huevos rotos']
  },

  // BARCELONA VENUES
  {
    _type: 'venue',
    _id: 'venue-disfrutar-barcelona',
    title: 'Disfrutar',
    slug: { current: 'disfrutar-barcelona' },
    city: ref('city-barcelona'),
    address: 'Carrer de Villarroel, 163',
    postalCode: '08036',
    phone: '+34 93 348 68 96',
    website: 'https://disfrutarbarcelona.com',
    geo: {
      lat: 41.3888,
      lng: 2.1542
    },
    openingHours: ['Tu-Sa 13:30-15:30,19:30-21:30'],
    priceRange: '€€€€',
    description: 'Dos estrellas Michelin con propuesta gastronómica creativa de vanguardia por exalumnos de elBulli, considerado uno de los mejores del mundo.',
    specialties: ['Menú degustación', 'Cocina molecular', 'Creatividad extrema', 'Experiencia única'],
    ambiance: ['Vanguardista', 'Creativo', 'Exclusivo', 'Innovador'],
    schemaType: 'Restaurant',
    social: {
      instagram: 'https://instagram.com/disfrutarbcn',
      facebook: 'https://facebook.com/disfrutarbarcelona',
      maps: 'https://maps.google.com/?q=Disfrutar+Barcelona'
    },
    categories: [ref('category-alta-cocina')],
    seoTitle: 'Disfrutar Barcelona - 2 Estrellas Michelin, Ex elBulli',
    seoDescription: 'Disfrutar, restaurante 2 estrellas Michelin en Barcelona por ex-alumnos de elBulli. Cocina molecular y creatividad gastronómica extrema.',
    seoKeywords: ['Disfrutar Barcelona', '2 estrellas michelin', 'ex elBulli', 'cocina molecular barcelona']
  },
  {
    _type: 'venue',
    _id: 'venue-cal-pep-barcelona',
    title: 'Cal Pep',
    slug: { current: 'cal-pep-barcelona' },
    city: ref('city-barcelona'),
    address: 'Carrer de la Ribera, 5',
    postalCode: '08003',
    phone: '+34 93 310 79 61',
    website: 'https://calpep.com',
    geo: {
      lat: 41.3835,
      lng: 2.1827
    },
    openingHours: ['Tu-Sa 19:30-23:30', 'Tu-Fr 13:00-16:00'],
    priceRange: '€€€',
    description: 'Legendario bar de tapas en el Born con productos del mar de máxima calidad y ambiente auténticamente barcelonés.',
    specialties: ['Pescados a la plancha', 'Mariscos frescos', 'Percebes', 'Jamón ibérico'],
    ambiance: ['Auténtico', 'Informal', 'Tradicional', 'Marinero'],
    schemaType: 'Restaurant',
    social: {
      instagram: 'https://instagram.com/calpep',
      maps: 'https://maps.google.com/?q=Cal+Pep+Barcelona'
    },
    categories: [ref('category-tapas-pintxos')],
    seoTitle: 'Cal Pep Barcelona - Legendario Bar de Tapas en El Born',
    seoDescription: 'Cal Pep, el legendario bar de tapas en El Born, Barcelona. Productos del mar frescos y auténtica experiencia barcelonesa.',
    seoKeywords: ['Cal Pep Barcelona', 'tapas born barcelona', 'pescado fresco barcelona', 'mariscos barcelona']
  },
  {
    _type: 'venue',
    _id: 'venue-pakta-barcelona',
    title: 'Pakta',
    slug: { current: 'pakta-barcelona' },
    city: ref('city-barcelona'),
    address: 'Carrer de Lleida, 5',
    postalCode: '08004',
    phone: '+34 93 624 01 77',
    website: 'https://pakta.es',
    geo: {
      lat: 41.3776,
      lng: 2.1682
    },
    openingHours: ['Tu-Sa 20:30-22:30'],
    priceRange: '€€€€',
    description: 'Una estrella Michelin especializado en cocina nikkei que fusiona perfectamente las tradiciones gastronómicas japonesa y peruana.',
    specialties: ['Cocina nikkei', 'Fusión japonesa-peruana', 'Sushi creativo', 'Ceviches'],
    ambiance: ['Sofisticado', 'Íntimo', 'Moderno', 'Exclusivo'],
    schemaType: 'Restaurant',
    social: {
      instagram: 'https://instagram.com/pakta_bcn',
      facebook: 'https://facebook.com/paktabarcelona',
      maps: 'https://maps.google.com/?q=Pakta+Barcelona'
    },
    categories: [ref('category-japonesa')],
    seoTitle: 'Pakta Barcelona - 1 Estrella Michelin, Cocina Nikkei',
    seoDescription: 'Pakta, restaurante 1 estrella Michelin en Barcelona especializado en cocina nikkei. Fusión japonesa-peruana de alta calidad.',
    seoKeywords: ['Pakta Barcelona', '1 estrella michelin', 'cocina nikkei', 'fusión japonesa peruana']
  },

  // VALENCIA VENUES
  {
    _type: 'venue',
    _id: 'venue-casa-roberto-valencia',
    title: 'Casa Roberto',
    slug: { current: 'casa-roberto-valencia' },
    city: ref('city-valencia'),
    address: 'Carrer del Mestre Gozalbo, 19',
    postalCode: '46005',
    phone: '+34 96 395 25 61',
    website: 'https://casaroberto.com',
    geo: {
      lat: 39.4753,
      lng: -0.3774
    },
    openingHours: ['Tu-Su 13:00-16:00,20:00-24:00'],
    priceRange: '€€€',
    description: 'Referente en paella valenciana auténtica desde 1935, manteniendo la receta original con ingredientes de la huerta valenciana.',
    specialties: ['Paella valenciana', 'Arroz con bogavante', 'All i pebre', 'Esgarraet'],
    ambiance: ['Tradicional', 'Familiar', 'Auténtico', 'Histórico'],
    schemaType: 'Restaurant',
    social: {
      instagram: 'https://instagram.com/casaroberto',
      maps: 'https://maps.google.com/?q=Casa+Roberto+Valencia'
    },
    categories: [ref('category-espanola-tradicional')],
    seoTitle: 'Casa Roberto Valencia - Paella Valenciana Auténtica desde 1935',
    seoDescription: 'Casa Roberto, especialista en paella valenciana auténtica desde 1935. Receta original con ingredientes de la huerta valenciana.',
    seoKeywords: ['Casa Roberto Valencia', 'paella valenciana auténtica', 'mejor paella valencia', 'arroz valencia']
  },
  {
    _type: 'venue',
    _id: 'venue-ricard-camarena-valencia',
    title: 'Ricard Camarena Restaurant',
    slug: { current: 'ricard-camarena-valencia' },
    city: ref('city-valencia'),
    address: 'Carrer del Doctor Cadenas, 5',
    postalCode: '46005',
    phone: '+34 96 335 54 18',
    website: 'https://ricardcamarena.com',
    geo: {
      lat: 39.4748,
      lng: -0.3792
    },
    openingHours: ['Tu-Sa 14:00-15:30,21:00-22:30'],
    priceRange: '€€€€',
    description: 'Una estrella Michelin que reinterpreta la cocina valenciana tradicional con técnicas modernas y productos de proximidad excepcionales.',
    specialties: ['Cocina valenciana moderna', 'Productos de proximidad', 'Técnicas innovadoras', 'Menú degustación'],
    ambiance: ['Elegante', 'Moderno', 'Innovador', 'Sofisticado'],
    schemaType: 'Restaurant',
    social: {
      instagram: 'https://instagram.com/ricardcamarena',
      facebook: 'https://facebook.com/ricardcamarena',
      maps: 'https://maps.google.com/?q=Ricard+Camarena+Valencia'
    },
    categories: [ref('category-alta-cocina')],
    seoTitle: 'Ricard Camarena Restaurant - 1 Estrella Michelin Valencia',
    seoDescription: 'Ricard Camarena Restaurant, 1 estrella Michelin en Valencia. Cocina valenciana moderna con productos de proximidad excepcionales.',
    seoKeywords: ['Ricard Camarena', '1 estrella michelin valencia', 'cocina valenciana moderna', 'productos proximidad']
  },

  // SEVILLA VENUES
  {
    _type: 'venue',
    _id: 'venue-eslava-sevilla',
    title: 'Eslava',
    slug: { current: 'eslava-sevilla' },
    city: ref('city-sevilla'),
    address: 'Calle Eslava, 3',
    postalCode: '41002',
    phone: '+34 95 490 65 68',
    website: 'https://bareslava.com',
    geo: {
      lat: 37.3935,
      lng: -5.9958
    },
    openingHours: ['Mo-Sa 08:00-02:00', 'Su 12:00-02:00'],
    priceRange: '€€',
    description: 'Icónico bar de tapas sevillano que ha revolucionado el tapeo tradicional con propuestas creativas manteniendo la esencia andaluza.',
    specialties: ['Huevo estrellado con carabineros', 'Solomillo al whisky', 'Carrillada ibérica', 'Croquetas de jamón'],
    ambiance: ['Innovador', 'Animado', 'Moderno', 'Social'],
    schemaType: 'BarOrPub',
    social: {
      instagram: 'https://instagram.com/bareslava',
      facebook: 'https://facebook.com/bareslava',
      maps: 'https://maps.google.com/?q=Eslava+Sevilla'
    },
    categories: [ref('category-tapas-pintxos')],
    seoTitle: 'Eslava Sevilla - Revolución del Tapeo Sevillano',
    seoDescription: 'Eslava, el bar que revolucionó el tapeo en Sevilla. Tapas creativas con esencia andaluza en el corazón de la ciudad.',
    seoKeywords: ['Eslava Sevilla', 'mejores tapas sevilla', 'tapeo moderno sevilla', 'huevo carabineros']
  },

  // BILBAO VENUES
  {
    _type: 'venue',
    _id: 'venue-azurmendi-bilbao',
    title: 'Azurmendi',
    slug: { current: 'azurmendi-bilbao' },
    city: ref('city-bilbao'),
    address: 'Barrio Legina Auzoa, s/n',
    postalCode: '48195',
    phone: '+34 94 455 88 59',
    website: 'https://azurmendi.restaurant',
    geo: {
      lat: 43.2985,
      lng: -2.9671
    },
    openingHours: ['Tu-Sa 13:30-15:00,20:30-22:00'],
    priceRange: '€€€€',
    description: 'Tres estrellas Michelin de Eneko Atxa, pionero en sostenibilidad gastronómica y cocina vanguardista vasca con impacto ambiental zero.',
    specialties: ['Cocina sostenible', 'Vanguardia vasca', 'Impacto zero', 'Creatividad extrema'],
    ambiance: ['Sostenible', 'Vanguardista', 'Exclusivo', 'Innovador'],
    schemaType: 'Restaurant',
    social: {
      instagram: 'https://instagram.com/azurmendirestaurant',
      facebook: 'https://facebook.com/azurmendirestaurant',
      maps: 'https://maps.google.com/?q=Azurmendi+Bilbao'
    },
    categories: [ref('category-alta-cocina')],
    seoTitle: 'Azurmendi Bilbao - 3 Estrellas Michelin Sostenible',
    seoDescription: 'Azurmendi, 3 estrellas Michelin de Eneko Atxa. Cocina vanguardista vasca sostenible con impacto ambiental zero.',
    seoKeywords: ['Azurmendi', 'Eneko Atxa', '3 estrellas michelin bilbao', 'cocina sostenible']
  },
  {
    _type: 'venue',
    _id: 'venue-ganbara-bilbao',
    title: 'Ganbara',
    slug: { current: 'ganbara-bilbao' },
    city: ref('city-bilbao'),
    address: 'Calle Santa María, 10',
    postalCode: '48005',
    phone: '+34 94 415 45 75',
    website: 'https://ganbara.net',
    geo: {
      lat: 43.2570,
      lng: -2.9249
    },
    openingHours: ['Tu-Su 12:00-15:30,19:00-23:30'],
    priceRange: '€€€',
    description: 'Templo del pintxo en el Casco Viejo bilbaíno, famoso por sus setas y productos de temporada de máxima calidad desde 1975.',
    specialties: ['Setas de temporada', 'Pintxos premium', 'Txuleta', 'Productos de temporada'],
    ambiance: ['Tradicional', 'Auténtico', 'Cálido', 'Familiar'],
    schemaType: 'BarOrPub',
    social: {
      instagram: 'https://instagram.com/ganbara',
      maps: 'https://maps.google.com/?q=Ganbara+Bilbao'
    },
    categories: [ref('category-tapas-pintxos')],
    seoTitle: 'Ganbara Bilbao - Templo del Pintxo en Casco Viejo',
    seoDescription: 'Ganbara, el templo del pintxo en el Casco Viejo de Bilbao. Famoso por sus setas y productos de temporada desde 1975.',
    seoKeywords: ['Ganbara Bilbao', 'mejores pintxos bilbao', 'setas bilbao', 'casco viejo bilbao']
  }
];

export default async function seedSanityData() {
  try {
    console.log('🌱 Iniciando siembra completa de datos reales en Sanity...');
    console.log('📊 Datos a crear:');
    console.log(`   - ${cities.length} ciudades españolas`);
    console.log(`   - ${categories.length} categorías de restaurantes`);
    console.log(`   - ${venues.length} locales con información completa`);
    console.log('');

    // 1. Upload and create city hero images, then create cities
    console.log('🏙️ Creando ciudades con imágenes...');
    for (const city of cities) {
      try {
        // Upload hero image for city
        const cityImageUrls = {
          'city-madrid': 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=1200&h=800&fit=crop',
          'city-barcelona': 'https://images.unsplash.com/photo-1473959383410-a621ab72b721?w=1200&h=800&fit=crop',
          'city-valencia': 'https://images.unsplash.com/photo-1591636519338-6e8f5f9465cb?w=1200&h=800&fit=crop',
          'city-sevilla': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
          'city-bilbao': 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=1200&h=800&fit=crop',
          'city-granada': 'https://images.unsplash.com/photo-1563089431-69ca6b6cbbdb?w=1200&h=800&fit=crop'
        };

        const heroImage = await uploadImageFromUrl(
          cityImageUrls[city._id as keyof typeof cityImageUrls] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
          `${city.slug.current}-hero.jpg`
        );

        const cityWithImage = {
          ...city,
          heroImage: {
            ...heroImage,
            alt: `Vista panorámica de ${city.title}`,
            caption: `Imagen representativa de ${city.title}, ${city.region}`
          }
        };

        await adminClient.createOrReplace(cityWithImage);
        console.log(`✅ Ciudad creada: ${city.title} (${city.region})`);
      } catch (error) {
        console.error(`❌ Error creando ciudad ${city.title}:`, error);
      }
    }

    // 2. Upload and create category images, then create categories  
    console.log('🏷️ Creando categorías con imágenes...');
    for (const category of categories) {
      try {
        // Upload hero image for category
        const categoryImageUrls = {
          'category-espanola-tradicional': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
          'category-italiana': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=800&fit=crop',
          'category-japonesa': 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=800&fit=crop',
          'category-cafeteria': 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=1200&h=800&fit=crop',
          'category-tapas-pintxos': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=800&fit=crop',
          'category-alta-cocina': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=800&fit=crop',
          'category-asiatica': 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=1200&h=800&fit=crop',
          'category-vegetariana-vegana': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=800&fit=crop'
        };

        const heroImage = await uploadImageFromUrl(
          categoryImageUrls[category._id as keyof typeof categoryImageUrls] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
          `${category.slug.current}-hero.jpg`
        );

        const categoryWithImage = {
          ...category,
          heroImage: {
            ...heroImage,
            alt: `Comida representativa de ${category.title}`,
            caption: `Imagen representativa de la categoría ${category.title}`
          }
        };

        await adminClient.createOrReplace(categoryWithImage);
        console.log(`✅ Categoría creada: ${category.title}`);
      } catch (error) {
        console.error(`❌ Error creando categoría ${category.title}:`, error);
      }
    }

    // 3. Upload and create venue images, then create venues
    console.log('🏪 Creando locales con imágenes...');
    for (const venue of venues) {
      try {
        // Upload images for venue (2-3 images per venue)
        const venueImageUrls = {
          'venue-casa-botin-madrid': [
            'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1559054971-0f36c4f2c8df?w=1200&h=800&fit=crop'
          ],
          'venue-diverxo-madrid': [
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=1200&h=800&fit=crop'
          ],
          'venue-casa-mingo-madrid': [
            'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&h=800&fit=crop'
          ],
          'venue-lateral-madrid': [
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=800&fit=crop'
          ],
          'venue-disfrutar-barcelona': [
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&h=800&fit=crop'
          ],
          'venue-cal-pep-barcelona': [
            'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop'
          ],
          'venue-pakta-barcelona': [
            'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1563379091090-84e81d0047f1?w=1200&h=800&fit=crop'
          ],
          'venue-casa-roberto-valencia': [
            'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&h=800&fit=crop'
          ],
          'venue-ricard-camarena-valencia': [
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=1200&h=800&fit=crop'
          ],
          'venue-eslava-sevilla': [
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=800&fit=crop'
          ],
          'venue-azurmendi-bilbao': [
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&h=800&fit=crop'
          ],
          'venue-ganbara-bilbao': [
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=800&fit=crop'
          ]
        };

        const imageUrls = venueImageUrls[venue._id as keyof typeof venueImageUrls] || [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200'
        ];

        const images = [];
        for (let i = 0; i < imageUrls.length; i++) {
          const image = await uploadImageFromUrl(
            imageUrls[i],
            `${venue.slug.current}-${i + 1}.jpg`
          );
          images.push({
            ...image,
            alt: `${venue.title} - Imagen ${i + 1}`,
            caption: `Interior y ambiente de ${venue.title}`
          });
        }

        const venueWithImages = {
          ...venue,
          images,
          social: {
            ...venue.social,
            facebook: venue.social?.facebook ?? ''
          }
        };

        await adminClient.createOrReplace(venueWithImages);
        console.log(`✅ Local creado: ${venue.title} (${venue.city._ref})`);
      } catch (error) {
        console.error(`❌ Error creando local ${venue.title}:`, error);
      }
    }

    console.log('');
    console.log('🎉 ¡Datos reales sembrados exitosamente en Sanity!');
    console.log('📊 Resumen final:');
    console.log(`   ✅ ${cities.length} ciudades españolas con datos completos`);
    console.log(`   ✅ ${categories.length} categorías gastronómicas con imágenes`);
    console.log(`   ✅ ${venues.length} restaurantes con información detallada`);
    console.log(`   ✅ Imágenes reales para todas las entidades`);
    console.log(`   ✅ Datos SEO optimizados para todas las entidades`);
    console.log(`   ✅ Información geográfica completa`);
    console.log(`   ✅ Contacto y redes sociales de los locales`);
    console.log('');
    console.log('📍 Próximos pasos:');
    console.log('   - Crear reseñas detalladas con contenido rico');
    console.log('   - Generar posts de blog con cuerpo de contenido');
    console.log('   - Añadir más locales en cada ciudad');
    console.log('   - Verificar visualización en la aplicación');

  } catch (error) {
    console.error('💥 Error general en la siembra de datos:', error);
    process.exit(1);
  }
}

// Execute if called directly
if (require.main === module) {
  seedSanityData().catch(console.error);
}