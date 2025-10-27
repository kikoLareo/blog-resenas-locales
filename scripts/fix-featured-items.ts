import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function fixFeaturedItems() {
  console.log('🔧 Arreglando Featured Items...\n');

  try {
    // 1. Obtener todos los featuredItems actuales
    const currentItems = await client.fetch<Array<{ _id: string; type: string; reviewRef: any; venueRef: any }>>(
      `*[_type == "featuredItem"]{ _id, type, reviewRef, venueRef }`
    );

    console.log(`📋 Found ${currentItems.length} featured items\n`);

    // 2. Eliminar los que tienen reviewRef o venueRef null
    const brokenItems = currentItems.filter(item => {
      if (item.type === 'review' && !item.reviewRef) return true;
      if (item.type === 'venue' && !item.venueRef) return true;
      return false;
    });

    console.log(`🗑️  Deleting ${brokenItems.length} broken items...\n`);

    for (const item of brokenItems) {
      await client.delete(item._id);
      console.log(`  ✅ Deleted ${item._id}`);
    }

    // 3. Obtener venues destacados para crear featuredItems
    const venues = await client.fetch<Array<{ _id: string; title: string; slug: { current: string }; city: { title: string; slug: { current: string } } }>>(
      `*[_type == "venue"]{ _id, title, slug, city->{ title, slug } } | order(title asc)[0...4]`
    );

    console.log(`\n🏪 Found ${venues.length} venues to feature\n`);

    // 4. Crear featuredItems para cada venue
    let order = 0;
    for (const venue of venues) {
      const featuredItemId = `featured-venue-${venue.slug.current}`;
      
      console.log(`📝 Creating featured item for: ${venue.title}`);

      const featuredItem = {
        _id: featuredItemId,
        _type: 'featuredItem',
        type: 'venue',
        isActive: true,
        order: order++,
        customTitle: null,
        customDescription: null,
        customImage: null,
        customUrl: null,
        venueRef: {
          _type: 'reference',
          _ref: venue._id,
        },
      };

      await client.createOrReplace(featuredItem);
      console.log(`  ✅ Created/Updated: ${featuredItemId}`);
      console.log(`     URL: /${venue.city.slug.current}/${venue.slug.current}\n`);
    }

    console.log('\n🎉 Featured items fixed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Deleted: ${brokenItems.length} broken items`);
    console.log(`   - Created: ${venues.length} venue featured items`);
    console.log('\n💡 All featured items now point to venue pages (locals)');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixFeaturedItems();
