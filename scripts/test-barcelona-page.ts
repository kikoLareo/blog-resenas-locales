import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function testBarcelonaPage() {
  console.log('🔍 Testing Barcelona city page data...\n');
  
  // Test 1: Check if city exists
  const city = await client.fetch(`
    *[_type == "city" && slug.current == "barcelona"][0]{
      _id,
      title,
      slug,
      description,
      region,
      heroImage,
      "venueCount": count(*[_type == "venue" && city._ref == ^._id]),
      "reviewCount": count(*[_type == "review" && venue->city._ref == ^._id && published == true])
    }
  `);
  
  if (!city) {
    console.error('❌ Barcelona city NOT FOUND in Sanity!');
    console.log('\n💡 This is why /barcelona is failing');
    return;
  }
  
  console.log('✅ Barcelona city exists:');
  console.log(JSON.stringify(city, null, 2));
  console.log('');
  
  // Test 2: Check if there are venues
  if (city.venueCount === 0) {
    console.warn('⚠️  No venues found for Barcelona');
  } else {
    console.log(`✅ Found ${city.venueCount} venues in Barcelona`);
  }
  
  // Test 3: Check if there are reviews
  if (city.reviewCount === 0) {
    console.warn('⚠️  No reviews found for Barcelona');
  } else {
    console.log(`✅ Found ${city.reviewCount} reviews in Barcelona`);
  }
  
  // Test 4: List venues in Barcelona
  console.log('\n📋 Venues in Barcelona:');
  const venues = await client.fetch(`
    *[_type == "venue" && city->slug.current == "barcelona"]{
      title,
      "slug": slug.current,
      "url": "/" + city->slug.current + "/" + slug.current
    }
  `);
  
  venues.forEach((venue: any, i: number) => {
    console.log(`  ${i + 1}. ${venue.title}`);
    console.log(`     URL: ${venue.url}`);
  });
  
  console.log('\n💡 Expected URL: https://blog-resenas-locales.vercel.app/barcelona');
  console.log('💡 This page should work if city has title field');
}

testBarcelonaPage();
