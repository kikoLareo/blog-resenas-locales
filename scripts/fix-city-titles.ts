import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const cityNames: Record<string, string> = {
  'barcelona': 'Barcelona',
  'madrid': 'Madrid',
  'valencia': 'Valencia',
  'sevilla': 'Sevilla',
  'bilbao': 'Bilbao',
};

async function fixCityTitles() {
  console.log('🏙️  Actualizando títulos de ciudades...\n');

  try {
    // Fetch all cities
    const cities = await client.fetch<Array<{ _id: string; slug: { current: string }; title?: string }>>(
      `*[_type == "city"]{ _id, slug, title }`
    );

    console.log(`Found ${cities.length} cities\n`);

    for (const city of cities) {
      const slugCurrent = city.slug.current;
      const expectedTitle = cityNames[slugCurrent];

      if (!expectedTitle) {
        console.log(`⚠️  No title mapping for slug: ${slugCurrent}`);
        continue;
      }

      if (city.title === expectedTitle) {
        console.log(`✅ ${expectedTitle} - Already has correct title`);
        continue;
      }

      console.log(`🔄 Updating ${slugCurrent} → title: "${expectedTitle}"`);

      await client
        .patch(city._id)
        .set({ title: expectedTitle })
        .commit();

      console.log(`✅ Updated ${expectedTitle}\n`);
    }

    console.log('\n🎉 All city titles updated successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixCityTitles();
