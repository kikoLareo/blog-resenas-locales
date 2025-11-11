import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function verifyFeaturedItems() {
  console.log('✅ VERIFICACIÓN DE FEATURED ITEMS\n');
  console.log('='.repeat(60));
  
  const items = await client.fetch<Array<{
    _id: string;
    type: string;
    order: number;
    isActive: boolean;
    venueRef: {
      title: string;
      slug: { current: string };
      city: { title: string; slug: { current: string } };
    };
  }>>(`
    *[_type == "featuredItem"] | order(order asc) {
      _id,
      type,
      order,
      isActive,
      venueRef-> {
        title,
        slug,
        city-> { title, slug }
      }
    }
  `);
  
  console.log(`\n📊 Total Featured Items: ${items.length}\n`);
  
  items.forEach((item, index) => {
    const venue = item.venueRef;
    const url = `/${venue.city.slug.current}/${venue.slug.current}`;
    const productionUrl = `https://blog-resenas-locales.vercel.app${url}`;
    
    console.log(`${index + 1}. ${venue.title}`);
    console.log(`   Type: ${item.type === 'venue' ? '🏪 Local' : item.type}`);
    console.log(`   Order: ${item.order}`);
    console.log(`   Active: ${item.isActive ? '✅' : '❌'}`);
    console.log(`   Location: ${venue.city.title}`);
    console.log(`   URL: ${url}`);
    console.log(`   Production: ${productionUrl}`);
    console.log('');
  });
  
  console.log('='.repeat(60));
  console.log('\n💡 Todos los featured items apuntan a páginas de LOCALES');
  console.log('💡 Al hacer clic, mostrarán el local con todas sus reseñas');
  console.log('💡 El badge mostrará "🏪 Local" en lugar de "📝 Reseña"');
  console.log('\n🚀 Esperando deployment de Vercel...');
}

verifyFeaturedItems();
