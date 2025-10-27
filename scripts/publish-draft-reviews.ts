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

async function publishDraftReviews() {
  console.log('📝 Publicando reviews en DRAFT...\n');

  try {
    // Obtener todas las reviews en draft
    const draftReviews = await client.fetch(`
      *[_type == "review" && !defined(published) || published == false] {
        _id,
        title,
        "venue": venue->title
      }
    `);

    console.log(`Encontradas ${draftReviews.length} reviews en DRAFT\n`);

    if (draftReviews.length === 0) {
      console.log('✅ No hay reviews en draft para publicar');
      return;
    }

    for (const review of draftReviews) {
      console.log(`📌 Publicando: "${review.title}"`);
      console.log(`   Venue: ${review.venue}`);
      console.log(`   ID: ${review._id}`);

      // Publicar la review
      await client
        .patch(review._id.replace('drafts.', ''))
        .set({ published: true, publishedAt: new Date().toISOString() })
        .commit();

      console.log(`   ✅ Publicada\n`);
    }

    console.log('🎉 Todas las reviews han sido publicadas');
    console.log('Ahora las URLs deberían funcionar correctamente.');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

publishDraftReviews();
