import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function addSushiIkigai() {
  console.log('🔍 Buscando Sushi Ikigai...');
  
  const venue = await client.fetch<{ _id: string; title: string; slug: { current: string } }>(
    `*[_type == "venue" && slug.current == "sushi-ikigai"][0]{ _id, title, slug }`
  );
  
  if (!venue) {
    console.log('❌ Sushi Ikigai no encontrado');
    return;
  }
  
  console.log(`✅ Found: ${venue.title}`);
  console.log(`   ID: ${venue._id}\n`);
  
  const featuredItem = {
    _id: 'featured-venue-sushi-ikigai',
    _type: 'featuredItem',
    type: 'venue',
    isActive: true,
    order: 0,
    venueRef: {
      _type: 'reference',
      _ref: venue._id,
    },
  };
  
  await client.createOrReplace(featuredItem);
  console.log('🎉 Added Sushi Ikigai as featured item with order 0');
}

addSushiIkigai();
