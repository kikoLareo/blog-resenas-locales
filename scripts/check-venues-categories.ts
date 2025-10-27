import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function checkVenuesCategories() {
  console.log('🔍 Checking venues categories...\n');
  
  const venues = await client.fetch<Array<{
    _id: string;
    title: string;
    slug: { current: string };
    categories: any;
    city: { title: string };
  }>>(`
    *[_type == "venue"]{
      _id,
      title,
      slug,
      categories,
      city->{ title }
    }
  `);
  
  console.log(`📊 Total venues: ${venues.length}\n`);
  
  const withoutCategories = venues.filter(v => !v.categories || v.categories.length === 0);
  
  if (withoutCategories.length > 0) {
    console.log(`⚠️  Venues WITHOUT categories: ${withoutCategories.length}\n`);
    withoutCategories.forEach((venue, i) => {
      console.log(`${i + 1}. ${venue.title} (${venue.city?.title || 'Sin ciudad'})`);
      console.log(`   ID: ${venue._id}`);
      console.log(`   Slug: ${venue.slug?.current}`);
      console.log('');
    });
  } else {
    console.log('✅ All venues have categories!');
  }
  
  const withNullCategories = venues.filter(v => v.categories === null);
  if (withNullCategories.length > 0) {
    console.log(`\n❌ Venues with NULL categories: ${withNullCategories.length}`);
    withNullCategories.forEach(v => {
      console.log(`   - ${v.title}`);
    });
  }
}

checkVenuesCategories();
