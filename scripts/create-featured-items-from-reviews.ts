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

async function createFeaturedItemsFromReviews() {
  console.log('🎯 Creando Featured Items desde Reviews destacadas...\n');

  try {
    // 1. Obtener reviews con featured: true
    const featuredReviews = await client.fetch(`
      *[_type == "review" && featured == true] {
        _id,
        title,
        summary,
        tldr,
        publishedAt,
        ratings,
        gallery[0] {
          asset->{ url }
        },
        "venue": venue-> {
          title,
          slug,
          "city": city->{ title, slug }
        }
      }
    `);

    console.log(`📝 Encontradas ${featuredReviews.length} reviews con featured: true\n`);

    if (featuredReviews.length === 0) {
      console.log('❌ No hay reviews destacadas. Ejecuta primero add-sample-reviews.ts');
      return;
    }

    // 2. Crear featuredItems para cada review
    for (let i = 0; i < featuredReviews.length; i++) {
      const review = featuredReviews[i];
      
      const featuredItemData = {
        _type: 'featuredItem',
        title: review.title,
        type: 'review',
        customTitle: review.title,
        customDescription: review.summary || review.tldr || `Reseña de ${review.venue?.title || 'restaurante'}`,
        customCTA: 'Leer reseña completa',
        customUrl: `/${review.venue?.city?.slug?.current || 'madrid'}/${review.venue?.slug?.current || 'local'}/review`,
        isActive: true,
        order: i,
        reviewRef: {
          _type: 'reference',
          _ref: review._id
        }
      };

      const result = await client.create(featuredItemData);
      console.log(`✅ Featured Item creado: "${result.title}" (ID: ${result._id})`);
      console.log(`   Referencia a review: ${review._id}`);
      console.log(`   Orden: ${i}\n`);
    }

    console.log('🎉 ¡Featured Items creados exitosamente!');
    console.log('Ahora ve a /dashboard/featured para verlos y gestionarlos.');
    console.log('También aparecerán en el hero de la homepage.\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

createFeaturedItemsFromReviews();
