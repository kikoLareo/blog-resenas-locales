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
  token: process.env.SANITY_API_TOKEN,
});

async function checkFeaturedItemsStatus() {
  console.log('🎯 Verificando estado de Featured Items...\n');

  try {
    // Obtener todos los featuredItems con detalles
    const featuredItems = await client.fetch(`
      *[_type == "featuredItem"] | order(order asc) {
        _id,
        title,
        type,
        isActive,
        order,
        "reviewTitle": reviewRef->title,
        "reviewId": reviewRef->_id
      }
    `);

    console.log(`📊 Total de Featured Items: ${featuredItems.length}\n`);

    // Separar por estado
    const active = featuredItems.filter((item: any) => item.isActive === true);
    const inactive = featuredItems.filter((item: any) => item.isActive !== true);

    console.log(`✅ ACTIVOS (${active.length}) - Deberían aparecer en el hero:`);
    console.log('=' .repeat(60));
    active.forEach((item: any, index: number) => {
      console.log(`${index + 1}. "${item.title}"`);
      console.log(`   Orden: ${item.order}`);
      console.log(`   Tipo: ${item.type}`);
      console.log(`   Review: ${item.reviewTitle || 'N/A'}`);
      console.log(`   ID: ${item._id}\n`);
    });

    if (inactive.length > 0) {
      console.log(`\n❌ INACTIVOS (${inactive.length}) - NO aparecen en el hero:`);
      console.log('=' .repeat(60));
      inactive.forEach((item: any, index: number) => {
        console.log(`${index + 1}. "${item.title}"`);
        console.log(`   Orden: ${item.order}`);
        console.log(`   ID: ${item._id}\n`);
      });
    }

    console.log('\n📝 Resumen:');
    console.log(`- El hero mostrará ${active.length} items`);
    console.log(`- Dashboard muestra ${featuredItems.length} items (todos)`);
    
    if (active.length !== 4) {
      console.log('\n⚠️  NOTA: Hay 4 reviews con featured:true pero solo ' + active.length + ' featuredItems activos');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkFeaturedItemsStatus();
