/**
 * Script para añadir datos de contenido SEO a Sanity
 * Guías, listas, recetas, guías de platos, noticias y ofertas
 */

import { createClient } from '@sanity/client';

// Configuración del cliente con token de escritura para seeds
const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: "sk5pdI1X71JKsFKbiWMFyXEiG8mOeBpze9ZsQBfxHfVMmkZmzfE5ixogDmbesz7dg4bIAqHNkDst2tJq9bv7BhE1VwIG1sJ6PK3uZhYuW0MLsqtpxzQYNQl14bOwiV17ZEhhCx6XTNy3Yjje0ViA31DU31ibKfguaZQYzcBU0vE7Kp7ZMZ3D",
  useCdn: false,
});

// Datos de guías
const guides: any[] = [
  {
    _type: 'guide',
    _id: 'guide-malasana-2025',
    title: 'Dónde comer en Malasaña 2025 (mapa + 25 sitios)',
    slug: { current: 'donde-comer-malasana-2025' },
    excerpt: 'Guía completa de los mejores restaurantes, bares y cafés de Malasaña. Desde locales tradicionales hasta nuevas aperturas gastronómicas.',
    type: 'neighborhood',
    city: { _type: 'reference', _ref: 'city-madrid' },
    neighborhood: 'Malasaña',
    published: true,
    featured: true,
    publishedAt: new Date('2025-01-10T09:00:00Z').toISOString(),
    lastUpdated: new Date('2025-01-15T10:30:00Z').toISOString(),
    sections: [
      {
        title: 'Restaurantes tradicionales',
        venues: [
          { _type: 'reference', _ref: 'venue-pizzeria-tradizionale' }
        ]
      },
      {
        title: 'Nuevas aperturas',
        venues: []
      }
    ],
    stats: {
      views: 2840,
      shares: 156,
      bookmarks: 89
    },
    seoTitle: 'Dónde comer en Malasaña Madrid 2025 - 25 Mejores Restaurantes',
    seoDescription: 'Guía completa de los mejores restaurantes de Malasaña, Madrid. 25 locales recomendados con mapa, precios y reseñas actualizadas.',
    seoKeywords: ['donde comer malasaña', 'restaurantes malasaña madrid', 'mejores bares malasaña', 'guía gastronómica malasaña']
  },
  {
    _type: 'guide',
    _id: 'guide-ruta-tapas-latina',
    title: 'Ruta de tapas por La Latina: 5 paradas imprescindibles',
    slug: { current: 'ruta-tapas-la-latina' },
    excerpt: 'Recorrido gastronómico por los mejores bares de tapas de La Latina. Una ruta perfecta para descubrir la tradición taurina de Madrid.',
    type: 'thematic',
    city: { _type: 'reference', _ref: 'city-madrid' },
    neighborhood: 'La Latina',
    theme: 'tapas',
    published: true,
    featured: false,
    publishedAt: new Date('2025-01-08T11:30:00Z').toISOString(),
    lastUpdated: new Date('2025-01-12T14:20:00Z').toISOString(),
    sections: [
      {
        title: 'Paradas de la ruta',
        venues: []
      }
    ],
    stats: {
      views: 1920,
      shares: 87,
      bookmarks: 45
    },
    seoTitle: 'Ruta de Tapas por La Latina Madrid - 5 Bares Imprescindibles',
    seoDescription: 'La mejor ruta de tapas por La Latina, Madrid. 5 bares tradicionales con las mejores tapas y ambiente castizo.',
    seoKeywords: ['ruta tapas la latina', 'bares la latina madrid', 'tapas tradicionales madrid', 'donde tapear la latina']
  },
  {
    _type: 'guide',
    _id: 'guide-comer-barato-chueca',
    title: 'Comer bien y barato en Chueca: 15 opciones bajo 20€',
    slug: { current: 'comer-barato-chueca' },
    excerpt: 'Guía de restaurantes económicos en Chueca sin renunciar a la calidad. Opciones para todos los bolsillos en el corazón de Madrid.',
    type: 'budget',
    city: { _type: 'reference', _ref: 'city-madrid' },
    neighborhood: 'Chueca',
    published: false,
    featured: false,
    publishedAt: null,
    lastUpdated: new Date('2025-01-14T16:45:00Z').toISOString(),
    sections: [
      {
        title: 'Restaurantes económicos',
        venues: []
      },
      {
        title: 'Menús del día',
        venues: []
      }
    ],
    stats: {
      views: 0,
      shares: 0,
      bookmarks: 0
    },
    seoTitle: 'Comer Barato en Chueca Madrid - 15 Restaurantes bajo 20€',
    seoDescription: 'Guía de restaurantes económicos en Chueca, Madrid. 15 opciones para comer bien y barato sin renunciar a la calidad.',
    seoKeywords: ['comer barato chueca', 'restaurantes económicos chueca', 'menú del día chueca', 'donde comer barato madrid']
  }
];

// Datos de listas
const lists: any[] = [
  {
    _type: 'list',
    _id: 'list-mejores-pizzerias-madrid',
    title: '10 mejores pizzerías de Madrid (2025)',
    slug: { current: 'mejores-pizzerias-madrid-2025' },
    excerpt: 'Ranking de las mejores pizzerías de Madrid según nuestros expertos. Desde pizza napoletana hasta estilos modernos.',
    listType: 'top-dish',
    dish: 'Pizza',
    city: { _type: 'reference', _ref: 'city-madrid' },
    published: true,
    featured: true,
    publishedAt: new Date('2025-01-05T10:00:00Z').toISOString(),
    lastUpdated: new Date('2025-01-12T15:30:00Z').toISOString(),
    venues: [
      { _type: 'reference', _ref: 'venue-pizzeria-tradizionale' }
    ],
    criteria: 'Calidad de ingredientes, técnica de elaboración, ambiente y relación calidad-precio',
    stats: {
      views: 3420,
      shares: 234,
      bookmarks: 156
    },
    seoTitle: '10 Mejores Pizzerías de Madrid 2025 - Ranking Actualizado',
    seoDescription: 'Ranking de las mejores pizzerías de Madrid en 2025. Pizza napoletana, romana y estilos modernos según nuestros expertos.',
    seoKeywords: ['mejores pizzerías madrid', 'pizza napoletana madrid', 'ranking pizzerías madrid', 'mejor pizza madrid']
  },
  {
    _type: 'list',
    _id: 'list-mejores-sushi-barcelona',
    title: '8 mejores restaurantes de sushi en Barcelona',
    slug: { current: 'mejores-sushi-barcelona' },
    excerpt: 'Los mejores restaurantes de sushi de Barcelona. Desde omakase premium hasta sushi accesible de calidad.',
    listType: 'city-best',
    dish: 'Sushi',
    city: { _type: 'reference', _ref: 'city-barcelona' },
    published: true,
    featured: false,
    publishedAt: new Date('2025-01-08T12:00:00Z').toISOString(),
    lastUpdated: new Date('2025-01-10T09:15:00Z').toISOString(),
    venues: [
      { _type: 'reference', _ref: 'venue-ramen-barcelona' }
    ],
    criteria: 'Frescura del pescado, técnica del chef, ambiente y experiencia gastronómica',
    stats: {
      views: 2150,
      shares: 145,
      bookmarks: 89
    },
    seoTitle: '8 Mejores Restaurantes de Sushi en Barcelona 2025',
    seoDescription: 'Los mejores restaurantes de sushi de Barcelona. Omakase premium, sushi tradicional y opciones accesibles de calidad.',
    seoKeywords: ['mejores sushi barcelona', 'omakase barcelona', 'restaurantes japoneses barcelona', 'sushi fresco barcelona']
  }
];

// Datos de recetas
const recipes: any[] = [
  {
    _type: 'recipe',
    _id: 'recipe-paella-valenciana-autentica',
    title: 'Paella valenciana auténtica (receta tradicional)',
    slug: { current: 'paella-valenciana-autentica-receta-tradicional' },
    description: 'La receta tradicional de paella valenciana tal como se hace en Valencia. Ingredientes auténticos y técnica original.',
    recipeType: 'tradicional',
    difficulty: 'medium',
    prepTime: 30,
    cookTime: 45,
    servings: 6,
    ingredients: [
      { name: 'Arroz bomba', amount: '400g', notes: 'Esencial para la paella' },
      { name: 'Pollo', amount: '400g', notes: 'Cortado en trozos' },
      { name: 'Conejo', amount: '300g', notes: 'Cortado en trozos' },
      { name: 'Judías verdes', amount: '200g', notes: 'Cortadas en trozos' },
      { name: 'Garrofón', amount: '150g', notes: 'Judías blancas grandes' },
      { name: 'Tomate rallado', amount: '200g', notes: 'Tomate natural' },
      { name: 'Azafrán', amount: '1 pizca', notes: 'Para el color' },
      { name: 'Aceite de oliva', amount: '4 cucharadas', notes: 'Virgen extra' },
      { name: 'Sal', amount: 'al gusto', notes: '' },
      { name: 'Agua', amount: '1.2 litros', notes: 'Caliente' }
    ],
    instructions: [
      'Calentar el aceite en la paellera y dorar el pollo y conejo',
      'Añadir las judías verdes y el garrofón, cocinar 5 minutos',
      'Incorporar el tomate rallado y cocinar hasta que se evapore',
      'Añadir el azafrán y el agua caliente, hervir 20 minutos',
      'Distribuir el arroz en cruz y cocinar 18 minutos sin remover',
      'Dejar reposar 5 minutos antes de servir'
    ],
    tips: [
      'Usar siempre arroz bomba para la paella',
      'No remover el arroz una vez añadido',
      'El fuego debe ser uniforme bajo toda la paellera',
      'Dejar que se forme el socarrat en el fondo'
    ],
    nutrition: {
      calories: 450,
      protein: 25,
      carbs: 55,
      fat: 12,
      fiber: 3
    },
    published: true,
    featured: true,
    publishedAt: new Date('2025-01-12T08:00:00Z').toISOString(),
    lastUpdated: new Date('2025-01-15T10:00:00Z').toISOString(),
    stats: {
      views: 1850,
      shares: 98,
      bookmarks: 67
    },
    seoTitle: 'Paella Valenciana Auténtica - Receta Tradicional Original',
    seoDescription: 'Receta tradicional de paella valenciana auténtica. Ingredientes originales, técnica correcta y consejos de expertos valencianos.',
    seoKeywords: ['paella valenciana receta', 'receta paella tradicional', 'como hacer paella valenciana', 'paella auténtica valencia']
  },
  {
    _type: 'recipe',
    _id: 'recipe-tortilla-espanola-perfecta',
    title: 'Tortilla española perfecta (trucos y secretos)',
    slug: { current: 'tortilla-espanola-perfecta-trucos-secretos' },
    description: 'Los secretos para hacer la tortilla española perfecta. Técnica, ingredientes y trucos de los mejores cocineros.',
    recipeType: 'tradicional',
    difficulty: 'easy',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    ingredients: [
      { name: 'Patatas', amount: '1kg', notes: 'Patatas de freír' },
      { name: 'Huevos', amount: '8 unidades', notes: 'Frescos' },
      { name: 'Cebolla', amount: '1 grande', notes: 'Opcional' },
      { name: 'Aceite de oliva', amount: '200ml', notes: 'Para freír' },
      { name: 'Sal', amount: 'al gusto', notes: '' }
    ],
    instructions: [
      'Pelar y cortar las patatas en rodajas finas',
      'Freír las patatas en aceite abundante hasta que estén tiernas',
      'Escurrir las patatas y reservar el aceite',
      'Batir los huevos con sal y mezclar con las patatas',
      'Calentar una sartén con un poco de aceite',
      'Añadir la mezcla y cocinar a fuego medio',
      'Dar la vuelta con un plato y cocinar el otro lado'
    ],
    tips: [
      'Las patatas deben estar tiernas pero no doradas',
      'La mezcla debe reposar 10 minutos antes de cocinar',
      'Usar una sartén antiadherente',
      'El fuego debe ser medio para que no se queme'
    ],
    nutrition: {
      calories: 320,
      protein: 15,
      carbs: 35,
      fat: 18,
      fiber: 4
    },
    published: true,
    featured: false,
    publishedAt: new Date('2025-01-10T14:00:00Z').toISOString(),
    lastUpdated: new Date('2025-01-12T16:30:00Z').toISOString(),
    stats: {
      views: 1230,
      shares: 67,
      bookmarks: 45
    },
    seoTitle: 'Tortilla Española Perfecta - Receta y Trucos de Expertos',
    seoDescription: 'Aprende a hacer la tortilla española perfecta con los trucos y secretos de los mejores cocineros. Receta tradicional paso a paso.',
    seoKeywords: ['tortilla española receta', 'como hacer tortilla perfecta', 'tortilla de patatas', 'receta tortilla tradicional']
  }
];

// Datos de guías de platos
const dishGuides: any[] = [
  {
    _type: 'dish-guide',
    _id: 'dish-guide-paella-valenciana',
    title: 'Guía completa de la paella valenciana: historia, ingredientes y dónde comerla',
    slug: { current: 'guia-paella-valenciana-historia-ingredientes-donde-comerla' },
    excerpt: 'Todo sobre la paella valenciana: su historia, ingredientes auténticos, variaciones y los mejores lugares para degustarla.',
    dish: 'Paella valenciana',
    origin: 'Valencia, España',
    history: 'La paella valenciana nació en el siglo XIX en las zonas rurales de Valencia como un plato humilde de arroz con los ingredientes disponibles.',
    ingredients: [
      { name: 'Arroz bomba', description: 'Variedad de arroz de grano corto y redondo, esencial para la paella' },
      { name: 'Pollo y conejo', description: 'Carnes tradicionales de la paella valenciana auténtica' },
      { name: 'Judías verdes', description: 'Judías planas verdes, típicas de la huerta valenciana' },
      { name: 'Garrofón', description: 'Judías blancas grandes, ingrediente característico de la paella' }
    ],
    variations: [
      { name: 'Paella de mariscos', description: 'Variación costera con mariscos y pescados' },
      { name: 'Paella mixta', description: 'Combinación de carnes y mariscos' },
      { name: 'Paella de verduras', description: 'Versión vegetariana con verduras de temporada' }
    ],
    bestPlaces: [
      { _type: 'reference', _ref: 'venue-paella-valencia' }
    ],
    tips: [
      'Usar siempre arroz bomba para la paella',
      'El fuego debe ser uniforme bajo toda la paellera',
      'No remover el arroz una vez añadido',
      'Dejar que se forme el socarrat en el fondo'
    ],
    published: true,
    featured: true,
    publishedAt: new Date('2025-01-08T10:00:00Z').toISOString(),
    lastUpdated: new Date('2025-01-14T12:00:00Z').toISOString(),
    stats: {
      views: 2560,
      shares: 178,
      bookmarks: 123
    },
    seoTitle: 'Guía Completa de la Paella Valenciana - Historia, Ingredientes y Dónde Comerla',
    seoDescription: 'Todo sobre la paella valenciana: historia, ingredientes auténticos, variaciones y los mejores restaurantes para degustarla en Valencia.',
    seoKeywords: ['paella valenciana', 'historia paella valenciana', 'ingredientes paella auténtica', 'donde comer paella valencia']
  }
];

// Datos de noticias
const news: any[] = [
  {
    _type: 'news',
    _id: 'news-nueva-tendencia-gastronomica-madrid',
    title: 'Nueva tendencia gastronómica llega a Madrid: restaurantes sin menú',
    slug: { current: 'nueva-tendencia-gastronomica-madrid-restaurantes-sin-menu' },
    excerpt: 'Los restaurantes sin menú fijo se extienden por Madrid. Una nueva forma de entender la gastronomía que prioriza la frescura y la creatividad.',
    category: 'tendencias',
    city: { _type: 'reference', _ref: 'city-madrid' },
    published: true,
    featured: true,
    publishedAt: new Date('2025-01-15T08:00:00Z').toISOString(),
    expiryDate: new Date('2025-02-15T23:59:59Z').toISOString(),
    content: 'Una nueva tendencia gastronómica está revolucionando la escena culinaria de Madrid: los restaurantes sin menú fijo...',
    tags: ['tendencias gastronómicas', 'restaurantes madrid', 'innovación culinaria'],
    stats: {
      views: 890,
      shares: 45,
      bookmarks: 23
    },
    seoTitle: 'Nueva Tendencia Gastronómica en Madrid: Restaurantes Sin Menú',
    seoDescription: 'Los restaurantes sin menú fijo llegan a Madrid. Una nueva tendencia gastronómica que prioriza la frescura y la creatividad culinaria.',
    seoKeywords: ['tendencias gastronómicas madrid', 'restaurantes sin menú', 'innovación culinaria madrid', 'nuevos restaurantes madrid']
  }
];

// Datos de ofertas
const offers: any[] = [
  {
    _type: 'offer',
    _id: 'offer-menu-degustacion-sushi-ikigai',
    title: 'Menú degustación especial en Sushi Ikigai - 50% descuento',
    slug: { current: 'menu-degustacion-sushi-ikigai-50-descuento' },
    excerpt: 'Oferta especial: menú degustación de sushi premium con 50% de descuento en Sushi Ikigai. Válido hasta fin de mes.',
    venue: { _type: 'reference', _ref: 'venue-sushi-ikigai' },
    offerType: 'descuento',
    discount: 50,
    originalPrice: 120,
    offerPrice: 60,
    validFrom: new Date('2025-01-15T00:00:00Z').toISOString(),
    validUntil: new Date('2025-01-31T23:59:59Z').toISOString(),
    conditions: 'Válido de martes a jueves, reserva previa obligatoria',
    published: true,
    featured: true,
    publishedAt: new Date('2025-01-15T09:00:00Z').toISOString(),
    stats: {
      views: 450,
      shares: 23,
      bookmarks: 15
    },
    seoTitle: 'Oferta: Menú Degustación Sushi Ikigai Madrid - 50% Descuento',
    seoDescription: 'Oferta especial en Sushi Ikigai Madrid: menú degustación de sushi premium con 50% de descuento. Válido hasta fin de mes.',
    seoKeywords: ['oferta sushi madrid', 'sushi ikigai oferta', 'menú degustación sushi', 'descuento restaurante japonés madrid']
  }
];

async function seedSEOContent() {
  try {
    console.log('🌱 Iniciando la siembra de contenido SEO en Sanity...');

    // 1. Crear guías
    console.log('🗺️ Creando guías...');
    for (const guide of guides) {
      try {
        await adminClient.createOrReplace(guide);
        console.log(`✅ Guía creada: ${guide.title}`);
      } catch (error) {
        console.error(`❌ Error creando guía ${guide.title}:`, error);
      }
    }

    // 2. Crear listas
    console.log('📋 Creando listas...');
    for (const list of lists) {
      try {
        await adminClient.createOrReplace(list);
        console.log(`✅ Lista creada: ${list.title}`);
      } catch (error) {
        console.error(`❌ Error creando lista ${list.title}:`, error);
      }
    }

    // 3. Crear recetas
    console.log('👨‍🍳 Creando recetas...');
    for (const recipe of recipes) {
      try {
        await adminClient.createOrReplace(recipe);
        console.log(`✅ Receta creada: ${recipe.title}`);
      } catch (error) {
        console.error(`❌ Error creando receta ${recipe.title}:`, error);
      }
    }

    // 4. Crear guías de platos
    console.log('🍽️ Creando guías de platos...');
    for (const dishGuide of dishGuides) {
      try {
        await adminClient.createOrReplace(dishGuide);
        console.log(`✅ Guía de plato creada: ${dishGuide.title}`);
      } catch (error) {
        console.error(`❌ Error creando guía de plato ${dishGuide.title}:`, error);
      }
    }

    // 5. Crear noticias
    console.log('📰 Creando noticias...');
    for (const newsItem of news) {
      try {
        await adminClient.createOrReplace(newsItem);
        console.log(`✅ Noticia creada: ${newsItem.title}`);
      } catch (error) {
        console.error(`❌ Error creando noticia ${newsItem.title}:`, error);
      }
    }

    // 6. Crear ofertas
    console.log('🎁 Creando ofertas...');
    for (const offer of offers) {
      try {
        await adminClient.createOrReplace(offer);
        console.log(`✅ Oferta creada: ${offer.title}`);
      } catch (error) {
        console.error(`❌ Error creando oferta ${offer.title}:`, error);
      }
    }

    console.log('🎉 ¡Contenido SEO sembrado exitosamente en Sanity!');
    console.log('📊 Resumen:');
    console.log(`   - ${guides.length} guías`);
    console.log(`   - ${lists.length} listas`);
    console.log(`   - ${recipes.length} recetas`);
    console.log(`   - ${dishGuides.length} guías de platos`);
    console.log(`   - ${news.length} noticias`);
    console.log(`   - ${offers.length} ofertas`);

  } catch (error) {
    console.error('💥 Error general en la siembra de contenido SEO:', error);
    process.exit(1);
  }
}

// Ejecutar el script si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSEOContent()
    .then(() => {
      console.log('✨ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en el proceso:', error);
      process.exit(1);
    });
}

export default seedSEOContent;
