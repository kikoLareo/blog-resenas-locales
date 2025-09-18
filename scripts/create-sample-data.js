// Script para crear datos de ejemplo en Sanity
// Ejecutar con: node scripts/create-sample-data.js

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'xaenlpyp', // Tu project ID
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN || 'YOUR_TOKEN_HERE', // Necesitarás un token de escritura
  apiVersion: '2024-01-01',
  useCdn: false
});

async function createSampleData() {
  console.log('🚀 Creando datos de ejemplo...');

  try {
    // 1. Crear ciudades
    console.log('📍 Creando ciudades...');
    const cityMadrid = await client.createOrReplace({
      _id: 'city-madrid',
      _type: 'city',
      title: 'Madrid',
      slug: { current: 'madrid' },
      region: 'Comunidad de Madrid',
      description: 'La capital gastronómica de España con una increíble diversidad culinaria',
      featured: true,
      population: 3223000,
      highlights: ['Mercado de San Miguel', 'Barrio de La Latina', 'Restaurantes con estrella Michelin'],
      cuisineSpecialties: ['Cocido madrileño', 'Callos a la madrileña', 'Churros con chocolate']
    });

    const cityBarcelona = await client.createOrReplace({
      _id: 'city-barcelona',
      _type: 'city',
      title: 'Barcelona',
      slug: { current: 'barcelona' },
      region: 'Cataluña',
      description: 'Ciudad mediterránea con una rica tradición culinaria catalana',
      featured: true,
      population: 1620000,
      highlights: ['Mercado de La Boquería', 'Barrio Gótico', 'Tapas en el Born'],
      cuisineSpecialties: ['Pan con tomate', 'Paella', 'Crema catalana']
    });

    // 2. Crear categorías
    console.log('🏷️ Creando categorías...');
    const catMediterranea = await client.createOrReplace({
      _id: 'cat-mediterranea',
      _type: 'category',
      title: 'Cocina Mediterránea',
      slug: { current: 'cocina-mediterranea' },
      description: 'Sabores auténticos del Mediterráneo con ingredientes frescos y saludables',
      icon: '🌿',
      color: '#10b981',
      featured: true,
      cuisineType: 'mediterranean',
      schemaType: 'Restaurant'
    });

    const catTapas = await client.createOrReplace({
      _id: 'cat-tapas',
      _type: 'category',
      title: 'Tapas y Pinchos',
      slug: { current: 'tapas-pinchos' },
      description: 'La tradición española de compartir pequeños platos llenos de sabor',
      icon: '🍢',
      color: '#f59e0b',
      featured: true,
      cuisineType: 'spanish',
      schemaType: 'BarOrPub'
    });

    const catFusion = await client.createOrReplace({
      _id: 'cat-fusion',
      _type: 'category',
      title: 'Cocina Fusión',
      slug: { current: 'cocina-fusion' },
      description: 'Innovación culinaria que combina tradiciones de diferentes culturas',
      icon: '🌎',
      color: '#8b5cf6',
      featured: true,
      cuisineType: 'fusion',
      schemaType: 'Restaurant'
    });

    // 3. Crear locales
    console.log('🏪 Creando locales...');
    const venueMadrid1 = await client.createOrReplace({
      _id: 'venue-madrid-casa-lucio',
      _type: 'venue',
      title: 'Casa Lucio',
      slug: { current: 'casa-lucio' },
      description: 'Restaurante histórico famoso por sus huevos estrellados y ambiente tradicional',
      city: { _type: 'reference', _ref: cityMadrid._id },
      categories: [{ _type: 'reference', _ref: catMediterranea._id }],
      address: 'Calle Cava Baja, 35, Madrid',
      priceRange: '€€€',
      schemaType: 'Restaurant'
    });

    const venueBarcelona1 = await client.createOrReplace({
      _id: 'venue-barcelona-cal-pep',
      _type: 'venue',
      title: 'Cal Pep',
      slug: { current: 'cal-pep' },
      description: 'Icónica barra de tapas en el Born con productos frescos del mar',
      city: { _type: 'reference', _ref: cityBarcelona._id },
      categories: [{ _type: 'reference', _ref: catTapas._id }],
      address: 'Plaça de les Olles, 8, Barcelona',
      priceRange: '€€',
      schemaType: 'BarOrPub'
    });

    const venueMadrid2 = await client.createOrReplace({
      _id: 'venue-madrid-dstage',
      _type: 'venue',
      title: 'DSTAgE',
      slug: { current: 'dstage' },
      description: 'Restaurante de alta cocina con 2 estrellas Michelin y propuesta innovadora',
      city: { _type: 'reference', _ref: cityMadrid._id },
      categories: [{ _type: 'reference', _ref: catFusion._id }],
      address: 'Calle Regueros, 8, Madrid',
      priceRange: '€€€€',
      schemaType: 'Restaurant'
    });

    // 4. Crear reseñas
    console.log('⭐ Creando reseñas...');
    await client.createOrReplace({
      _id: 'review-casa-lucio-huevos',
      _type: 'review',
      title: 'Los míticos huevos estrellados de Casa Lucio: tradición pura',
      slug: { current: 'huevos-estrellados-casa-lucio' },
      venue: { _type: 'reference', _ref: venueMadrid1._id },
      author: 'María González',
      visitDate: '2024-12-01',
      publishedAt: new Date().toISOString(),
      ratings: {
        food: 9.0,
        service: 8.5,
        ambience: 8.0,
        value: 7.5
      },
      avgTicket: 45,
      tldr: 'Casa Lucio mantiene viva la tradición madrileña con sus famosos huevos estrellados. Ambiente histórico y sabores auténticos que no fallan.',
      pros: ['Huevos estrellados perfectos', 'Ambiente histórico único', 'Servicio tradicional'],
      cons: ['Precio elevado', 'Difícil conseguir mesa'],
      tags: ['Tradicional', 'Madrid', 'Huevos estrellados', 'Histórico'],
      featured: true
    });

    await client.createOrReplace({
      _id: 'review-cal-pep-tapas',
      _type: 'review',
      title: 'Cal Pep: la esencia del tapeo barcelonés en el Born',
      slug: { current: 'cal-pep-tapas-born' },
      venue: { _type: 'reference', _ref: venueBarcelona1._id },
      author: 'Carlos Ruiz',
      visitDate: '2024-11-28',
      publishedAt: new Date().toISOString(),
      ratings: {
        food: 8.5,
        service: 9.0,
        ambience: 8.5,
        value: 8.0
      },
      avgTicket: 35,
      tldr: 'Cal Pep es puro tapeo barcelonés. Productos frescos, ambiente auténtico y una experiencia gastronómica que no se olvida.',
      pros: ['Productos fresquísimos', 'Ambiente auténtico', 'Pep es un showman'],
      cons: ['Solo barra, no mesas', 'Colas largas'],
      tags: ['Tapas', 'Barcelona', 'Born', 'Mariscos'],
      featured: true
    });

    await client.createOrReplace({
      _id: 'review-dstage-michelin',
      _type: 'review',
      title: 'DSTAgE: alta cocina madrileña con 2 estrellas Michelin',
      slug: { current: 'dstage-alta-cocina-madrid' },
      venue: { _type: 'reference', _ref: venueMadrid2._id },
      author: 'Ana Martínez',
      visitDate: '2024-11-25',
      publishedAt: new Date().toISOString(),
      ratings: {
        food: 9.5,
        service: 9.5,
        ambience: 9.0,
        value: 7.0
      },
      avgTicket: 180,
      tldr: 'DSTAgE confirma por qué tiene 2 estrellas Michelin. Técnica impecable, creatividad y una experiencia gastronómica memorable.',
      pros: ['Técnica impecable', 'Creatividad sorprendente', 'Servicio excelente'],
      cons: ['Precio muy elevado', 'Porciones pequeñas'],
      tags: ['Michelin', 'Alta cocina', 'Madrid', 'Innovador'],
      featured: true
    });

    // 5. Crear posts
    console.log('📝 Creando posts...');
    await client.createOrReplace({
      _id: 'post-mejores-tapas-madrid',
      _type: 'post',
      title: 'Los 10 mejores lugares para tapear en Madrid',
      slug: { current: 'mejores-tapas-madrid' },
      excerpt: 'Descubre los rincones más auténticos de Madrid para disfrutar de las mejores tapas de la capital.',
      publishedAt: new Date().toISOString(),
      featured: true,
      author: 'Redacción SaborLocal',
      tags: ['Tapas', 'Madrid', 'Guía', 'Tradicional'],
      readingTime: 8
    });

    await client.createOrReplace({
      _id: 'post-mercados-gastronomicos-barcelona',
      _type: 'post',
      title: 'Mercados gastronómicos de Barcelona: guía completa',
      slug: { current: 'mercados-gastronomicos-barcelona' },
      excerpt: 'Un recorrido por los mercados más emblemáticos de Barcelona y sus mejores paradas gastronómicas.',
      publishedAt: new Date().toISOString(),
      featured: true,
      author: 'Redacción SaborLocal',
      tags: ['Barcelona', 'Mercados', 'Guía', 'Local'],
      readingTime: 6
    });

    console.log('✅ Datos de ejemplo creados exitosamente!');
    console.log('📊 Resumen:');
    console.log('   - 2 ciudades (Madrid, Barcelona)');
    console.log('   - 3 categorías (Mediterránea, Tapas, Fusión)');
    console.log('   - 3 locales (Casa Lucio, Cal Pep, DSTAgE)');
    console.log('   - 3 reseñas destacadas');
    console.log('   - 2 posts del blog');
    console.log('');
    console.log('🌐 Ve a http://localhost:3333/ para ver los datos en Sanity Studio');
    console.log('🏠 Ve a http://localhost:3000/ para ver la home con datos reales');

  } catch (error) {
    console.error('❌ Error creando datos:', error);
  }
}

// Ejecutar el script
createSampleData();
