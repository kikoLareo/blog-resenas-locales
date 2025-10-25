import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function addSampleReviews() {
  console.log('🍕 Creando reviews de ejemplo con datos reales...\n');

  const reviews = [
    {
      _type: 'review',
      title: 'La auténtica pizza napolitana de Madrid',
      slug: { current: 'autentica-pizza-napolitana-madrid' },
      published: true,
      featured: true,
      trending: true,
      publishedAt: new Date().toISOString(),
      summary: 'Descubre la mejor pizza napolitana de Madrid con masa madre de 48h de fermentación y productos importados directamente de Italia.',
      tldr: 'Pizza napolitana auténtica con ingredientes premium y técnica tradicional italiana.',
      tags: ['Pizza', 'Italiana', 'Napolitana', 'Masa Madre'],
      readTime: 5,
      ratings: {
        overall: 9.2,
        food: 9.5,
        service: 9.0,
        ambience: 8.8,
        valueForMoney: 8.5
      },
      author: 'María García - Experta en gastronomía italiana'
    },
    {
      _type: 'review',
      title: 'Tapas modernas con producto de temporada',
      slug: { current: 'tapas-modernas-producto-temporada' },
      published: true,
      featured: false,
      trending: true,
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Ayer
      summary: 'Un viaje culinario por las tapas españolas reinventadas con técnicas modernas y productos de km 0.',
      tldr: 'Tapas creativas con producto local de máxima calidad.',
      tags: ['Tapas', 'Moderna', 'Producto Local', 'Km 0'],
      readTime: 6,
      ratings: {
        overall: 8.8,
        food: 9.0,
        service: 8.5,
        ambience: 9.0,
        valueForMoney: 8.7
      },
      author: 'Carlos Ruiz - Crítico gastronómico'
    },
    {
      _type: 'review',
      title: 'Sushi de autor con pescado de lonja local',
      slug: { current: 'sushi-autor-pescado-lonja-local' },
      published: true,
      featured: false,
      trending: false,
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
      summary: 'Fusión perfecta entre la técnica japonesa y el producto español en este restaurante de sushi de autor.',
      tldr: 'Sushi excepcional con pescado fresco de lonja española.',
      tags: ['Sushi', 'Japonesa', 'Fusión', 'Pescado Fresco'],
      readTime: 7,
      ratings: {
        overall: 9.0,
        food: 9.3,
        service: 8.8,
        ambience: 8.9,
        valueForMoney: 8.5
      },
      author: 'Laura Martínez - Chef y crítica culinaria'
    }
  ];

  try {
    // Obtener el primer venue y city para relacionar las reviews
    const venues = await client.fetch(`*[_type == "venue"][0...3] { _id, title }`);
    
    if (venues.length === 0) {
      console.log('❌ No hay venues en Sanity. Por favor crea venues primero.');
      return;
    }

    for (let i = 0; i < reviews.length; i++) {
      const reviewData = {
        ...reviews[i],
        venue: {
          _type: 'reference',
          _ref: venues[i % venues.length]._id
        }
      };

      const result = await client.create(reviewData);
      console.log(`✅ Review creada: "${result.title}" (ID: ${result._id})`);
    }

    console.log('\n🎉 ¡Reviews de ejemplo creadas exitosamente!');
    console.log('Ahora la homepage mostrará contenido real en el hero y todas las secciones.');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

addSampleReviews();
