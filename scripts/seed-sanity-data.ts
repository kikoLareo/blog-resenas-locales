/**
 * Script para añadir datos de ejemplo a Sanity
 * Basado en los datos mock que teníamos anteriormente
 */

import { createClient } from '@sanity/client';

// Configuración del cliente con token de escritura para seeds
const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: "sk5pdI1X71JKsFKbiWMFyXEiG8mOeBpze9ZsQBfxHfVMmkZmzfE5ixogDmbesz7dg4bIAqHNkDst2tJq9bv7BhE1VwIG1sJ6PK3uZhYuW0MLsqtpxzQYNQl14bOwiV17ZEhhCx6XTNy3Yjje0ViA31DU31ibKfguaZQYzcBU0vE7Kp7ZMZ3D", // Usando el token de lectura que también tiene permisos de escritura
  useCdn: false,
});

// Datos de ciudades
const cities = [
  {
    _type: 'city',
    _id: 'city-madrid',
    title: 'Madrid',
    slug: { current: 'madrid' },
    region: 'Comunidad de Madrid',
    country: 'España',
    description: 'Capital de España y centro gastronómico de primer nivel con una escena culinaria vibrante y diversa.',
    localInfo: 'Madrid ofrece desde tabernas tradicionales hasta restaurantes de alta cocina, siendo famosa por sus tapas y vida nocturna.',
    population: 3223334,
    timezone: 'Europe/Madrid',
    seoTitle: 'Mejores Restaurantes en Madrid - Reseñas y Guías 2025',
    seoDescription: 'Descubre los mejores restaurantes de Madrid con nuestras reseñas detalladas. Desde tapas tradicionales hasta alta cocina.',
    seoKeywords: ['restaurantes madrid', 'tapas madrid', 'donde comer madrid', 'gastronomía madrid']
  },
  {
    _type: 'city',
    _id: 'city-barcelona',
    title: 'Barcelona',
    slug: { current: 'barcelona' },
    region: 'Cataluña',
    country: 'España',
    description: 'Ciudad cosmopolita con una rica tradición culinaria catalana y una innovadora escena gastronómica.',
    localInfo: 'Barcelona combina la tradición catalana con la innovación culinaria, destacando por sus pintxos, mariscos y creatividad.',
    population: 1620343,
    timezone: 'Europe/Madrid',
    seoTitle: 'Mejores Restaurantes en Barcelona - Reseñas y Guías 2025',
    seoDescription: 'Explora los mejores restaurantes de Barcelona. Desde cocina catalana tradicional hasta propuestas innovadoras.',
    seoKeywords: ['restaurantes barcelona', 'cocina catalana', 'donde comer barcelona', 'pintxos barcelona']
  },
  {
    _type: 'city',
    _id: 'city-valencia',
    title: 'Valencia',
    slug: { current: 'valencia' },
    region: 'Comunidad Valenciana',
    country: 'España',
    description: 'Cuna de la paella y destino gastronómico con una excelente relación calidad-precio.',
    localInfo: 'Valencia es famosa por su paella tradicional, horchata y una escena gastronómica en constante evolución.',
    population: 791413,
    timezone: 'Europe/Madrid',
    seoTitle: 'Mejores Restaurantes en Valencia - Reseñas y Guías 2025',
    seoDescription: 'Descubre los mejores restaurantes de Valencia, cuna de la paella. Reseñas detalladas y recomendaciones.',
    seoKeywords: ['restaurantes valencia', 'paella valencia', 'donde comer valencia', 'gastronomía valenciana']
  }
];

// Datos de categorías
const categories = [
  {
    _type: 'category',
    _id: 'category-italiana',
    title: 'Italiana',
    slug: { current: 'italiana' },
    description: 'Auténtica cocina italiana con pastas frescas, pizzas artesanales y sabores tradicionales de Italia.',
    icon: '🍝',
    color: '#2D5B3A',
    seoTitle: 'Mejores Restaurantes Italianos - Reseñas y Recomendaciones',
    seoDescription: 'Descubre los mejores restaurantes de cocina italiana. Pasta fresca, pizzas artesanales y sabores auténticos.',
    seoKeywords: ['restaurantes italianos', 'pasta fresca', 'pizza artesanal', 'cocina italiana']
  },
  {
    _type: 'category',
    _id: 'category-japonesa',
    title: 'Japonesa',
    slug: { current: 'japonesa' },
    description: 'Cocina japonesa tradicional y moderna con sushi fresco, ramen auténtico y técnicas milenarias.',
    icon: '🍣',
    color: '#8B4B3A',
    seoTitle: 'Mejores Restaurantes Japoneses - Sushi y Ramen Auténtico',
    seoDescription: 'Los mejores restaurantes japoneses con sushi fresco, ramen tradicional y cocina nikkei de calidad.',
    seoKeywords: ['restaurantes japoneses', 'sushi fresco', 'ramen auténtico', 'cocina japonesa']
  },
  {
    _type: 'category',
    _id: 'category-cafe',
    title: 'Cafetería',
    slug: { current: 'cafeteria' },
    description: 'Cafeterías acogedoras con café de especialidad, repostería artesanal y ambiente relajado.',
    icon: '☕',
    color: '#6B4B8A',
    seoTitle: 'Mejores Cafeterías - Café de Especialidad y Repostería',
    seoDescription: 'Encuentra las mejores cafeterías con café de especialidad, repostería artesanal y ambiente acogedor.',
    seoKeywords: ['mejores cafeterías', 'café especialidad', 'repostería artesanal', 'café madrid barcelona']
  }
];

// Datos de locales
const venues = [
  {
    _type: 'venue',
    _id: 'venue-cafe-encanto',
    title: 'Café con Encanto',
    slug: { current: 'cafe-con-encanto' },
    city: { _type: 'reference', _ref: 'city-madrid' },
    address: 'Calle Gran Vía, 42',
    postalCode: '28013',
    phone: '+34 91 123 4567',
    priceRange: '€€',
    openingHours: ['Mo-Fr 08:00-22:00', 'Sa-Su 09:00-23:00'],
    description: 'Acogedor café en el corazón de Madrid con repostería artesanal y café de especialidad.',
    specialties: ['Café de especialidad', 'Repostería artesanal', 'Brunch de fin de semana'],
    ambiance: ['Acogedor', 'Tranquilo', 'Perfecto para trabajar'],
    seoTitle: 'Café con Encanto Madrid - Café de Especialidad y Repostería',
    seoDescription: 'Café con Encanto en Gran Vía, Madrid. Café de especialidad, repostería artesanal y el mejor brunch de la ciudad.',
    seoKeywords: ['café madrid', 'brunch madrid', 'café especialidad madrid', 'repostería artesanal']
  },
  {
    _type: 'venue',
    _id: 'venue-sushi-ikigai',
    title: 'Sushi Ikigai',
    slug: { current: 'sushi-ikigai' },
    city: { _type: 'reference', _ref: 'city-madrid' },
    address: 'Calle Serrano, 88',
    postalCode: '28006',
    phone: '+34 91 987 6543',
    priceRange: '€€€',
    openingHours: ['Tu-Su 19:00-24:00'],
    description: 'Restaurante japonés auténtico con sushi de primera calidad y ambiente tradicional.',
    specialties: ['Sushi premium', 'Omakase', 'Sake premium'],
    ambiance: ['Tradicional', 'Íntimo', 'Elegante'],
    seoTitle: 'Sushi Ikigai Madrid - Sushi Premium y Omakase Auténtico',
    seoDescription: 'Sushi Ikigai en Serrano, Madrid. Sushi premium, menú omakase y la mejor selección de sake de la ciudad.',
    seoKeywords: ['sushi madrid', 'omakase madrid', 'restaurante japonés madrid', 'sake premium']
  },
  {
    _type: 'venue',
    _id: 'venue-pizzeria-tradizionale',
    title: 'Pizzeria Tradizionale',
    slug: { current: 'pizzeria-tradizionale' },
    city: { _type: 'reference', _ref: 'city-madrid' },
    address: 'Calle Malasaña, 15',
    postalCode: '28004',
    phone: '+34 91 555 7788',
    priceRange: '€€',
    openingHours: ['Mo-Su 12:00-24:00'],
    description: 'Auténtica pizzería italiana con horno de leña y ingredientes importados directamente de Italia.',
    specialties: ['Pizza napoletana', 'Pasta fresca', 'Tiramisú casero'],
    ambiance: ['Familiar', 'Auténtico', 'Animado'],
    seoTitle: 'Pizzeria Tradizionale Madrid - Pizza Napoletana Auténtica',
    seoDescription: 'Pizzeria Tradizionale en Malasaña, Madrid. Pizza napoletana en horno de leña con ingredientes italianos.',
    seoKeywords: ['pizza madrid', 'pizza napoletana', 'restaurante italiano madrid', 'horno leña']
  },
  {
    _type: 'venue',
    _id: 'venue-ramen-barcelona',
    title: 'Ramen Neko',
    slug: { current: 'ramen-neko' },
    city: { _type: 'reference', _ref: 'city-barcelona' },
    address: 'Carrer del Rec, 24',
    postalCode: '08003',
    phone: '+34 93 222 3344',
    priceRange: '€€',
    openingHours: ['Tu-Su 12:00-15:00', 'Tu-Su 19:00-23:00'],
    description: 'Ramen auténtico japonés con caldos caseros y fideos artesanales en el corazón de Barcelona.',
    specialties: ['Ramen tonkotsu', 'Gyoza caseras', 'Té verde matcha'],
    ambiance: ['Auténtico', 'Pequeño', 'Acogedor'],
    seoTitle: 'Ramen Neko Barcelona - Ramen Auténtico y Gyoza Caseras',
    seoDescription: 'Ramen Neko en El Born, Barcelona. Ramen tonkotsu auténtico, gyoza caseras y ambiente japonés tradicional.',
    seoKeywords: ['ramen barcelona', 'restaurante japonés barcelona', 'gyoza barcelona', 'ramen tonkotsu']
  },
  {
    _type: 'venue',
    _id: 'venue-paella-valencia',
    title: 'Casa de la Paella',
    slug: { current: 'casa-de-la-paella' },
    city: { _type: 'reference', _ref: 'city-valencia' },
    address: 'Plaza del Mercado Central, 8',
    postalCode: '46001',
    phone: '+34 96 111 2233',
    priceRange: '€€',
    openingHours: ['Mo-Su 12:00-16:00', 'Mo-Su 20:00-24:00'],
    description: 'Restaurante tradicional valenciano especializado en paella auténtica con ingredientes del Mercado Central.',
    specialties: ['Paella valenciana', 'Paella de mariscos', 'Horchata de chufa'],
    ambiance: ['Tradicional', 'Familiar', 'Típico valenciano'],
    seoTitle: 'Casa de la Paella Valencia - Paella Valenciana Auténtica',
    seoDescription: 'Casa de la Paella junto al Mercado Central de Valencia. Paella valenciana auténtica con ingredientes frescos.',
    seoKeywords: ['paella valencia', 'restaurante valenciano', 'paella auténtica', 'mercado central valencia']
  }
];

// Datos de reseñas
const reviews = [
  {
    _type: 'review',
    _id: 'review-brunch-cafe-encanto',
    title: 'Brunch de fin de semana en Café con Encanto',
    slug: { current: 'brunch-fin-semana-cafe-encanto' },
    venue: { _type: 'reference', _ref: 'venue-cafe-encanto' },
    publishedAt: new Date('2025-08-30').toISOString(),
    ratings: {
      overall: 4.2,
      food: 4.0,
      service: 4.5,
      ambiance: 4.0,
      value: 4.5
    },
    visitDate: new Date('2025-08-28').toISOString(),
    pricePerPerson: 18,
    groupSize: 2,
    occasion: 'Brunch de fin de semana',
    summary: 'Café acogedor perfecto para brunch con repostería artesanal excepcional y café de especialidad.',
    highlights: ['Croissants recién horneados', 'Café de especialidad', 'Ambiente relajado', 'Servicio atento'],
    improvements: ['Más opciones veganas', 'Reservas online'],
    seoTitle: 'Reseña: Brunch en Café con Encanto Madrid - ¿Vale la pena?',
    seoDescription: 'Reseña completa del brunch en Café con Encanto, Madrid. Análisis de comida, servicio, ambiente y relación calidad-precio.',
    seoKeywords: ['reseña café madrid', 'brunch madrid', 'café con encanto reseña', 'mejores brunches madrid']
  },
  {
    _type: 'review',
    _id: 'review-omakase-sushi-ikigai',
    title: 'Omakase en Sushi Ikigai: producto top y cortes precisos',
    slug: { current: 'omakase-sushi-ikigai-producto-top-cortes-precisos' },
    venue: { _type: 'reference', _ref: 'venue-sushi-ikigai' },
    publishedAt: new Date('2025-08-29').toISOString(),
    ratings: {
      overall: 4.7,
      food: 5.0,
      service: 4.5,
      ambiance: 4.5,
      value: 4.5
    },
    visitDate: new Date('2025-08-25').toISOString(),
    pricePerPerson: 85,
    groupSize: 2,
    occasion: 'Cena especial',
    summary: 'Experiencia omakase excepcional con pescado de primera calidad y técnica impecable del chef.',
    highlights: ['Pescado fresco premium', 'Técnica impecable', 'Presentación exquisita', 'Sake excepcional'],
    improvements: ['Precio elevado', 'Reservas difíciles de conseguir'],
    seoTitle: 'Reseña: Omakase en Sushi Ikigai Madrid - Experiencia Premium',
    seoDescription: 'Reseña detallada del omakase en Sushi Ikigai, Madrid. Análisis de calidad, técnica y experiencia gastronómica.',
    seoKeywords: ['reseña sushi madrid', 'omakase madrid', 'sushi ikigai reseña', 'mejor sushi madrid']
  },
  {
    _type: 'review',
    _id: 'review-pizza-masa-madre',
    title: 'La pizza de masa madre con 72h de fermentación',
    slug: { current: 'pizza-masa-madre-72h-fermentacion' },
    venue: { _type: 'reference', _ref: 'venue-pizzeria-tradizionale' },
    publishedAt: new Date('2025-08-31').toISOString(),
    ratings: {
      overall: 4.3,
      food: 4.5,
      service: 4.0,
      ambiance: 4.0,
      value: 4.5
    },
    visitDate: new Date('2025-08-27').toISOString(),
    pricePerPerson: 22,
    groupSize: 4,
    occasion: 'Cena con amigos',
    summary: 'Pizza napoletana auténtica con masa de larga fermentación y ingredientes de calidad excepcional.',
    highlights: ['Masa perfecta 72h fermentación', 'Horno de leña', 'Ingredientes italianos', 'Ambiente auténtico'],
    improvements: ['Tiempo de espera largo', 'Local pequeño'],
    seoTitle: 'Reseña: Pizza de Masa Madre en Pizzeria Tradizionale Madrid',
    seoDescription: 'Reseña de la pizza napoletana en Pizzeria Tradizionale, Madrid. Masa de 72h de fermentación y horno de leña.',
    seoKeywords: ['reseña pizza madrid', 'pizza napoletana madrid', 'pizzeria tradizionale reseña', 'mejor pizza madrid']
  }
];

// Datos de posts de blog
const posts = [
  {
    _type: 'post',
    _id: 'post-guia-mejores-cafes-madrid',
    title: 'Guía completa de los mejores cafés de Madrid 2025',
    slug: { current: 'guia-mejores-cafes-madrid-2025' },
    publishedAt: new Date('2025-08-25').toISOString(),
    excerpt: 'Descubre los cafés más especiales de Madrid, desde clásicos centenarios hasta nuevas cafeterías de especialidad.',
    readingTime: 8,
    seoTitle: 'Los 15 Mejores Cafés de Madrid 2025 - Guía Completa',
    seoDescription: 'Descubre los mejores cafés de Madrid en 2025. Desde cafés históricos hasta nuevas cafeterías de especialidad. Guía actualizada.',
    seoKeywords: ['mejores cafés madrid', 'cafeterías madrid 2025', 'café especialidad madrid', 'donde tomar café madrid']
  },
  {
    _type: 'post',
    _id: 'post-ruta-tapas-malasana',
    title: 'Ruta de tapas por Malasaña: 8 paradas imprescindibles',
    slug: { current: 'ruta-tapas-malasana-8-paradas-imprescindibles' },
    publishedAt: new Date('2025-08-20').toISOString(),
    excerpt: 'Un recorrido por los mejores bares de tapas del barrio más alternativo de Madrid.',
    readingTime: 6,
    seoTitle: 'Ruta de Tapas por Malasaña Madrid - 8 Bares Imprescindibles',
    seoDescription: 'La mejor ruta de tapas por Malasaña, Madrid. 8 bares tradicionales y modernos para una experiencia gastronómica completa.',
    seoKeywords: ['ruta tapas malasaña', 'bares malasaña madrid', 'tapas madrid', 'donde tapear malasaña']
  }
];

async function seedSanityData() {
  try {
    console.log('🌱 Iniciando la siembra de datos en Sanity...');

    // 1. Crear ciudades
    console.log('📍 Creando ciudades...');
    for (const city of cities) {
      try {
        await adminClient.createOrReplace(city);
        console.log(`✅ Ciudad creada: ${city.title}`);
      } catch (error) {
        console.error(`❌ Error creando ciudad ${city.title}:`, error);
      }
    }

    // 2. Crear categorías
    console.log('🏷️ Creando categorías...');
    for (const category of categories) {
      try {
        await adminClient.createOrReplace(category);
        console.log(`✅ Categoría creada: ${category.title}`);
      } catch (error) {
        console.error(`❌ Error creando categoría ${category.title}:`, error);
      }
    }

    // 3. Crear locales
    console.log('🏪 Creando locales...');
    for (const venue of venues) {
      try {
        await adminClient.createOrReplace(venue);
        console.log(`✅ Local creado: ${venue.title}`);
      } catch (error) {
        console.error(`❌ Error creando local ${venue.title}:`, error);
      }
    }

    // 4. Crear reseñas
    console.log('⭐ Creando reseñas...');
    for (const review of reviews) {
      try {
        await adminClient.createOrReplace(review);
        console.log(`✅ Reseña creada: ${review.title}`);
      } catch (error) {
        console.error(`❌ Error creando reseña ${review.title}:`, error);
      }
    }

    // 5. Crear posts
    console.log('📝 Creando posts de blog...');
    for (const post of posts) {
      try {
        await adminClient.createOrReplace(post);
        console.log(`✅ Post creado: ${post.title}`);
      } catch (error) {
        console.error(`❌ Error creando post ${post.title}:`, error);
      }
    }

    console.log('🎉 ¡Datos sembrados exitosamente en Sanity!');
    console.log('📊 Resumen:');
    console.log(`   - ${cities.length} ciudades`);
    console.log(`   - ${categories.length} categorías`);
    console.log(`   - ${venues.length} locales`);
    console.log(`   - ${reviews.length} reseñas`);
    console.log(`   - ${posts.length} posts de blog`);

  } catch (error) {
    console.error('💥 Error general en la siembra de datos:', error);
    process.exit(1);
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  seedSanityData()
    .then(() => {
      console.log('✨ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en el proceso:', error);
      process.exit(1);
    });
}

export default seedSanityData;
