const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const sampleFeaturedItems = [
  {
    _type: 'featuredItem',
    title: 'Reseña destacada del mes',
    type: 'collection',
    customTitle: 'Los mejores locales de A Coruña',
    customDescription: 'Descubre nuestra selección curada de los restaurantes más destacados de la ciudad',
    isActive: true,
    order: 1,
    customImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    seoKeywords: ['restaurantes', 'A Coruña', 'gastronomía', 'reseñas'],
    customCTA: 'Ver selección'
  },
  {
    _type: 'featuredItem',
    title: 'Guía gastronómica',
    type: 'guide',
    customTitle: 'Ruta de tapas por el centro',
    customDescription: 'Un recorrido por los mejores locales de tapas tradicionales gallegas',
    isActive: true,
    order: 2,
    customImage: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    seoKeywords: ['tapas', 'ruta gastronómica', 'Galicia', 'tradición'],
    customCTA: 'Explorar ruta'
  },
  {
    _type: 'featuredItem',
    title: 'Colección especial',
    type: 'collection',
    customTitle: 'Sabores del mar',
    customDescription: 'Los mejores mariscos y pescados frescos de la ría',
    isActive: true,
    order: 3,
    customImage: 'https://images.unsplash.com/photo-1544943342-6afe4e7b14c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    seoKeywords: ['marisco', 'pescado', 'ría', 'fresco'],
    customCTA: 'Descubrir'
  }
];

async function seedFeaturedItems() {
  try {
    console.log('🌱 Creando featured items de prueba...');
    
    for (const item of sampleFeaturedItems) {
      const result = await client.create(item);
      console.log(`✅ Created featured item: ${result.title}`);
    }
    
    console.log('🎉 Featured items creados exitosamente!');
  } catch (error) {
    console.error('❌ Error creating featured items:', error);
  }
}

seedFeaturedItems();
