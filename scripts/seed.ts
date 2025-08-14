#!/usr/bin/env tsx
/**
 * Script para poblar Sanity CMS con datos de ejemplo
 * Útil para desarrollo, testing y demos
 * 
 * Uso:
 * npm run seed
 * o
 * npx tsx scripts/seed.ts
 */

import { createClient } from '@sanity/client';

// =============================================
// CONFIGURACIÓN
// =============================================

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN!, // Token con permisos de escritura
});

// =============================================
// DATOS DE EJEMPLO
// =============================================

/**
 * Ciudades de ejemplo
 */
const SAMPLE_CITIES = [
  {
    _type: 'city',
    _id: 'city-madrid',
    name: 'Madrid',
    slug: { _type: 'slug', current: 'madrid' },
    description: 'La vibrante capital de España, conocida por su rica gastronomía y vida nocturna.',
    coordinates: {
      _type: 'geopoint',
      lat: 40.4168,
      lng: -3.7038
    }
  },
  {
    _type: 'city',
    _id: 'city-barcelona',
    name: 'Barcelona',
    slug: { _type: 'slug', current: 'barcelona' },
    description: 'Ciudad cosmopolita con una increíble escena culinaria mediterránea.',
    coordinates: {
      _type: 'geopoint',
      lat: 41.3851,
      lng: 2.1734
    }
  },
  {
    _type: 'city',
    _id: 'city-valencia',
    name: 'Valencia',
    slug: { _type: 'slug', current: 'valencia' },
    description: 'Cuna de la paella y hogar de una vibrante cultura gastronómica.',
    coordinates: {
      _type: 'geopoint',
      lat: 39.4699,
      lng: -0.3763
    }
  },
  {
    _type: 'city',
    _id: 'city-sevilla',
    name: 'Sevilla',
    slug: { _type: 'slug', current: 'sevilla' },
    description: 'Capital andaluza famosa por sus tapas y tradición culinaria.',
    coordinates: {
      _type: 'geopoint',
      lat: 37.3891,
      lng: -5.9845
    }
  }
];

/**
 * Categorías de ejemplo
 */
const SAMPLE_CATEGORIES = [
  {
    _type: 'category',
    _id: 'category-restaurantes',
    name: 'Restaurantes',
    slug: { _type: 'slug', current: 'restaurantes' },
    description: 'Los mejores restaurantes para una experiencia gastronómica completa',
    color: '#e45a07'
  },
  {
    _type: 'category',
    _id: 'category-cafes',
    name: 'Cafés',
    slug: { _type: 'slug', current: 'cafes' },
    description: 'Cafeterías acogedoras para disfrutar de un buen café',
    color: '#8b4513'
  },
  {
    _type: 'category',
    _id: 'category-bares',
    name: 'Bares',
    slug: { _type: 'slug', current: 'bares' },
    description: 'Bares y tabernas para tapas y bebidas',
    color: '#d2691e'
  },
  {
    _type: 'category',
    _id: 'category-heladerias',
    name: 'Heladerías',
    slug: { _type: 'slug', current: 'heladerias' },
    description: 'Los mejores helados artesanales de la ciudad',
    color: '#ff69b4'
  },
  {
    _type: 'category',
    _id: 'category-comida-rapida',
    name: 'Comida Rápida',
    slug: { _type: 'slug', current: 'comida-rapida' },
    description: 'Opciones rápidas pero deliciosas para comer sobre la marcha',
    color: '#ff6347'
  },
  {
    _type: 'category',
    _id: 'category-panaderia',
    name: 'Panaderías',
    slug: { _type: 'slug', current: 'panaderias' },
    description: 'Panaderías artesanales con los mejores panes y dulces',
    color: '#daa520'
  }
];

/**
 * Locales de ejemplo
 */
const SAMPLE_VENUES = [
  // Madrid
  {
    _type: 'venue',
    _id: 'venue-casa-lucio',
    name: 'Casa Lucio',
    slug: { _type: 'slug', current: 'casa-lucio' },
    description: 'Restaurante tradicional madrileño famoso por sus huevos rotos',
    address: 'Calle Cava Baja, 35, Madrid',
    coordinates: {
      _type: 'geopoint',
      lat: 40.4132,
      lng: -3.7087
    },
    city: { _type: 'reference', _ref: 'city-madrid' },
    category: { _type: 'reference', _ref: 'category-restaurantes' },
    priceRange: '€€€',
    phone: '+34 913 65 32 52',
    website: 'https://casalucio.es'
  },
  {
    _type: 'venue',
    _id: 'venue-cafe-central',
    name: 'Café Central',
    slug: { _type: 'slug', current: 'cafe-central' },
    description: 'Histórico café en el corazón de Madrid con jazz en vivo',
    address: 'Plaza del Ángel, 10, Madrid',
    coordinates: {
      _type: 'geopoint',
      lat: 40.4146,
      lng: -3.7006
    },
    city: { _type: 'reference', _ref: 'city-madrid' },
    category: { _type: 'reference', _ref: 'category-cafes' },
    priceRange: '€€',
    phone: '+34 913 69 41 43',
    website: 'https://cafecentralmadrid.com'
  },
  // Barcelona
  {
    _type: 'venue',
    _id: 'venue-cal-pep',
    name: 'Cal Pep',
    slug: { _type: 'slug', current: 'cal-pep' },
    description: 'Legendario bar de tapas en el Born con productos frescos del mercado',
    address: 'Plaça de les Olles, 8, Barcelona',
    coordinates: {
      _type: 'geopoint',
      lat: 41.3833,
      lng: 2.1834
    },
    city: { _type: 'reference', _ref: 'city-barcelona' },
    category: { _type: 'reference', _ref: 'category-bares' },
    priceRange: '€€€',
    phone: '+34 933 10 79 61'
  },
  {
    _type: 'venue',
    _id: 'venue-granja-viader',
    name: 'Granja Viader',
    slug: { _type: 'slug', current: 'granja-viader' },
    description: 'Histórica granja familiar desde 1870, famosa por su chocolate',
    address: 'Carrer d\'En Xuclà, 4, Barcelona',
    coordinates: {
      _type: 'geopoint',
      lat: 41.3818,
      lng: 2.1725
    },
    city: { _type: 'reference', _ref: 'city-barcelona' },
    category: { _type: 'reference', _ref: 'category-cafes' },
    priceRange: '€',
    phone: '+34 933 18 34 86'
  },
  // Valencia
  {
    _type: 'venue',
    _id: 'venue-la-pepica',
    name: 'La Pepica',
    slug: { _type: 'slug', current: 'la-pepica' },
    description: 'Restaurante histórico donde se inventó la paella valenciana',
    address: 'Passeig de Neptú, 6, Valencia',
    coordinates: {
      _type: 'geopoint',
      lat: 39.4669,
      lng: -0.3249
    },
    city: { _type: 'reference', _ref: 'city-valencia' },
    category: { _type: 'reference', _ref: 'category-restaurantes' },
    priceRange: '€€€',
    phone: '+34 963 71 03 66',
    website: 'https://lapepica.com'
  },
  {
    _type: 'venue',
    _id: 'venue-horchateria-santa-catalina',
    name: 'Horchatería Santa Catalina',
    slug: { _type: 'slug', current: 'horchateria-santa-catalina' },
    description: 'La horchatería más antigua de Valencia, desde 1936',
    address: 'Plaça de Santa Caterina, 6, Valencia',
    coordinates: {
      _type: 'geopoint',
      lat: 39.4738,
      lng: -0.3762
    },
    city: { _type: 'reference', _ref: 'city-valencia' },
    category: { _type: 'reference', _ref: 'category-heladerias' },
    priceRange: '€',
    phone: '+34 963 91 23 79'
  }
];

/**
 * Reseñas de ejemplo
 */
const SAMPLE_REVIEWS = [
  {
    _type: 'review',
    _id: 'review-casa-lucio-1',
    title: 'Una experiencia gastronómica inolvidable en Casa Lucio',
    slug: { _type: 'slug', current: 'casa-lucio-experiencia-gastronomica' },
    venue: { _type: 'reference', _ref: 'venue-casa-lucio' },
    excerpt: 'Casa Lucio es más que un restaurante, es una institución madrileña donde la tradición se sirve en cada plato.',
    content: [
      {
        _type: 'block',
        _key: 'content1',
        style: 'normal',
        children: [{
          _type: 'span',
          text: 'Visitar Casa Lucio es como hacer un viaje en el tiempo a la Madrid más auténtica. Este restaurante, situado en la histórica Cava Baja, ha sido durante décadas el refugio gastronómico de madrileños ilustres y visitantes de todo el mundo.'
        }],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'content2',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Los famosos huevos rotos'
        }],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'content3',
        style: 'normal',
        children: [{
          _type: 'span',
          text: 'Sin duda, el plato estrella son los huevos rotos con jamón. Una preparación aparentemente sencilla que Lucio ha elevado a la categoría de arte culinario. Las patatas, cortadas finamente y fritas a la perfección, se combinan con huevos de corral y jamón ibérico de primera calidad.'
        }],
        markDefs: []
      }
    ],
    tldr: {
      summary: 'Casa Lucio es un clásico madrileño imprescindible, famoso por sus huevos rotos y ambiente tradicional.',
      highlights: [
        'Huevos rotos legendarios',
        'Ambiente tradicional madrileño',
        'Servicio familiar y cercano',
        'Ingredientes de primera calidad'
      ],
      verdict: 'Una visita obligada para experimentar la auténtica gastronomía madrileña.'
    },
    scores: {
      overall: 9.2,
      food: 9.5,
      service: 8.8,
      atmosphere: 9.0,
      value: 8.5
    },
    priceRange: '€€€',
    tags: ['tradicional', 'huevos-rotos', 'madrid-clasico', 'familiar'],
    publishedAt: '2024-01-15T10:00:00Z',
    featured: true,
    seo: {
      metaTitle: 'Casa Lucio Madrid: Reseña de los mejores huevos rotos | Blog Reseñas',
      metaDescription: 'Descubre por qué Casa Lucio es el templo de los huevos rotos en Madrid. Reseña completa del restaurante más tradicional de Cava Baja.'
    }
  },
  {
    _type: 'review',
    _id: 'review-cal-pep-1',
    title: 'Cal Pep: El arte de las tapas barcelonesas en su máxima expresión',
    slug: { _type: 'slug', current: 'cal-pep-arte-tapas-barcelona' },
    venue: { _type: 'reference', _ref: 'venue-cal-pep' },
    excerpt: 'En Cal Pep no hay carta ni mesas, solo una barra donde Pep y su equipo crean magia con los mejores productos del mar.',
    content: [
      {
        _type: 'block',
        _key: 'content1',
        style: 'normal',
        children: [{
          _type: 'span',
          text: 'Cal Pep es mucho más que un bar de tapas; es una experiencia gastronómica única donde el chef Pep Manubens ha convertido la improvisación en un arte. Situado en el corazón del Born, este pequeño local sin mesas ni carta tradicional ha conquistado a barceloneses y turistas por igual.'
        }],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'content2',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'La experiencia de la barra'
        }],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'content3',
        style: 'normal',
        children: [{
          _type: 'span',
          text: 'La magia comienza desde el momento en que te sientas en la barra. Pep te pregunta qué te gusta, qué no toleras, y a partir de ahí comienza un espectáculo culinario personalizado. Las tapas van llegando una tras otra: almejas a la plancha, alcachofas baby, jamón ibérico cortado al momento, y su famosa tortilla de patatas trufada.'
        }],
        markDefs: []
      }
    ],
    tldr: {
      summary: 'Cal Pep ofrece la experiencia de tapas más auténtica de Barcelona, con productos frescos y servicio personalizado en la barra.',
      highlights: [
        'Experiencia personalizada en la barra',
        'Productos frescos del mercado diario',
        'Ambiente auténtico barcelonés',
        'Tapas creativas y tradicionales'
      ],
      verdict: 'Imprescindible para entender la cultura de tapas catalana.'
    },
    scores: {
      overall: 9.0,
      food: 9.3,
      service: 9.5,
      atmosphere: 8.7,
      value: 8.2
    },
    priceRange: '€€€',
    tags: ['tapas', 'barcelona', 'born', 'productos-frescos', 'experiencia-unica'],
    publishedAt: '2024-01-10T14:30:00Z',
    featured: true,
    seo: {
      metaTitle: 'Cal Pep Barcelona: La mejor experiencia de tapas del Born | Reseña',
      metaDescription: 'Descubre Cal Pep, el legendario bar de tapas de Barcelona donde cada visita es única. Reseña completa del templo gastronómico del Born.'
    }
  },
  {
    _type: 'review',
    _id: 'review-la-pepica-1',
    title: 'La Pepica: Donde nació la auténtica paella valenciana',
    slug: { _type: 'slug', current: 'la-pepica-autentica-paella-valenciana' },
    venue: { _type: 'reference', _ref: 'venue-la-pepica' },
    excerpt: 'En La Pepica no solo comes paella, vives la historia de este plato emblemático en el lugar donde todo comenzó.',
    content: [
      {
        _type: 'block',
        _key: 'content1',
        style: 'normal',
        children: [{
          _type: 'span',
          text: 'La Pepica no es solo un restaurante, es un pedazo de la historia gastronómica española. Fundado en 1898 en la playa de Las Arenas, este establecimiento ha servido paella a personalidades como Ernest Hemingway, Joaquín Sorolla y la familia real española.'
        }],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'content2',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'La paella valenciana auténtica'
        }],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'content3',
        style: 'normal',
        children: [{
          _type: 'span',
          text: 'Aquí la paella valenciana se prepara como manda la tradición: con arroz bomba de Calasparra, pollo, conejo, garrofó, judía verde, tomate, pimiento rojo, azafrán y aceite de oliva. Nada más, nada menos. Cada paella se cocina al momento en paelleras de hierro sobre fuego de leña, respetando los tiempos y la técnica ancestral.'
        }],
        markDefs: []
      }
    ],
    tldr: {
      summary: 'La Pepica es el templo de la paella valenciana auténtica, con más de 125 años de historia y tradición culinaria.',
      highlights: [
        'Paella valenciana tradicional auténtica',
        'Más de 125 años de historia',
        'Cocina con leña tradicional',
        'Vista al mar Mediterráneo',
        'Ingredientes locales de calidad'
      ],
      verdict: 'La experiencia definitiva para conocer la verdadera paella valenciana.'
    },
    scores: {
      overall: 8.8,
      food: 9.2,
      service: 8.5,
      atmosphere: 9.0,
      value: 8.5
    },
    priceRange: '€€€',
    tags: ['paella', 'valencia', 'tradicional', 'historia', 'mediterraneo'],
    publishedAt: '2024-01-05T12:00:00Z',
    featured: true,
    seo: {
      metaTitle: 'La Pepica Valencia: La auténtica paella valenciana desde 1898 | Reseña',
      metaDescription: 'Descubre La Pepica, el restaurante histórico donde nació la paella valenciana. Reseña completa del templo de la gastronomía valenciana.'
    }
  }
];

// =============================================
// FUNCIONES DE UTILIDAD
// =============================================

/**
 * Limpia la base de datos (CUIDADO: borra todo el contenido)
 */
async function cleanDatabase(): Promise<void> {
  console.log('🧹 Limpiando base de datos...');
  
  const types = ['review', 'venue', 'category', 'city'];
  
  for (const type of types) {
    const query = `*[_type == "${type}"][0...100]`;
    const documents = await sanityClient.fetch(query);
    
    if (documents.length > 0) {
      const transaction = sanityClient.transaction();
      documents.forEach((doc: any) => {
        transaction.delete(doc._id);
      });
      
      await transaction.commit();
      console.log(`   ✅ Eliminados ${documents.length} documentos de tipo "${type}"`);
    }
  }
}

/**
 * Crea documentos en lotes
 */
async function createDocuments(documents: any[], typeName: string): Promise<void> {
  console.log(`📝 Creando ${documents.length} ${typeName}...`);
  
  const transaction = sanityClient.transaction();
  documents.forEach(doc => {
    transaction.createOrReplace(doc);
  });
  
  await transaction.commit();
  console.log(`   ✅ ${typeName} creados exitosamente`);
}

/**
 * Verifica la conexión con Sanity
 */
async function verifyConnection(): Promise<void> {
  try {
    await sanityClient.fetch('*[_type == "city"][0]');
    console.log('✅ Conexión con Sanity verificada');
  } catch (error) {
    console.error('❌ Error conectando con Sanity:', error);
    throw error;
  }
}

// =============================================
// FUNCIÓN PRINCIPAL
// =============================================

async function main(): Promise<void> {
  console.log('🌱 Iniciando proceso de seed...');
  console.log(`📍 Proyecto: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`📂 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
  
  try {
    // Verificar variables de entorno
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID no está configurado');
    }
    
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      throw new Error('SANITY_API_WRITE_TOKEN no está configurado (necesario para escribir)');
    }

    // Verificar conexión
    await verifyConnection();

    const startTime = Date.now();

    // Preguntar si limpiar la base de datos
    const shouldClean = process.argv.includes('--clean');
    if (shouldClean) {
      console.log('⚠️  Modo limpieza activado - Se eliminará todo el contenido existente');
      await cleanDatabase();
    }

    // Crear datos en orden (las referencias deben existir primero)
    await createDocuments(SAMPLE_CITIES, 'ciudades');
    await createDocuments(SAMPLE_CATEGORIES, 'categorías');
    await createDocuments(SAMPLE_VENUES, 'locales');
    await createDocuments(SAMPLE_REVIEWS, 'reseñas');

    const duration = Date.now() - startTime;
    console.log(`🎉 ¡Seed completado en ${duration}ms!`);
    console.log('');
    console.log('📊 Datos creados:');
    console.log(`   - ${SAMPLE_CITIES.length} ciudades`);
    console.log(`   - ${SAMPLE_CATEGORIES.length} categorías`);
    console.log(`   - ${SAMPLE_VENUES.length} locales`);
    console.log(`   - ${SAMPLE_REVIEWS.length} reseñas`);
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Verificar el contenido en Sanity Studio (/studio)');
    console.log('2. Revisar que las referencias estén correctas');
    console.log('3. Personalizar el contenido según tus necesidades');
    console.log('4. Añadir imágenes a los documentos desde el Studio');

  } catch (error) {
    console.error('❌ Error en el proceso de seed:', error);
    process.exit(1);
  }
}

// =============================================
// COMANDOS ADICIONALES
// =============================================

/**
 * Solo crear ciudades
 */
async function seedCities(): Promise<void> {
  await verifyConnection();
  await createDocuments(SAMPLE_CITIES, 'ciudades');
}

/**
 * Solo crear categorías
 */
async function seedCategories(): Promise<void> {
  await verifyConnection();
  await createDocuments(SAMPLE_CATEGORIES, 'categorías');
}

/**
 * Solo crear locales
 */
async function seedVenues(): Promise<void> {
  await verifyConnection();
  await createDocuments(SAMPLE_VENUES, 'locales');
}

/**
 * Solo crear reseñas
 */
async function seedReviews(): Promise<void> {
  await verifyConnection();
  await createDocuments(SAMPLE_REVIEWS, 'reseñas');
}

// =============================================
// EJECUCIÓN
// =============================================

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  // Comandos específicos
  const command = process.argv[2];
  
  switch (command) {
    case 'cities':
      seedCities().catch(console.error);
      break;
    case 'categories':
      seedCategories().catch(console.error);
      break;
    case 'venues':
      seedVenues().catch(console.error);
      break;
    case 'reviews':
      seedReviews().catch(console.error);
      break;
    default:
      main().catch((error) => {
        console.error('💥 Error fatal:', error);
        process.exit(1);
      });
  }
}

export {
  seedCities,
  seedCategories,
  seedVenues,
  seedReviews,
  cleanDatabase,
  main as seed,
};