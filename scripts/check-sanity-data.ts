import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function checkSanityData() {
  console.log('🔍 Verificando datos en Sanity...\n');
  console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET, '\n');

  try {
    // 1. Check Featured Items
    const featuredItems = await client.fetch(`
      *[_type == "featuredItem"] {
        _id,
        title,
        type,
        isActive
      }
    `);
    console.log('📌 Featured Items:', featuredItems.length);
    if (featuredItems.length > 0) {
      console.log('   Primeros 3:', featuredItems.slice(0, 3).map((item: any) => ({
        title: item.title,
        type: item.type,
        active: item.isActive
      })));
    }

    // 2. Check Reviews with FULL details and URLs
    const reviews = await client.fetch(`
      *[_type == "review"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        published,
        "venue": venue->{
          title,
          slug,
          "city": city->{
            title,
            slug
          }
        },
        featured,
        trending,
        ratings
      }
    `);
    console.log('\n📝 Reviews TODAS:', reviews.length);
    
    console.log('\n🔗 URLs de Reviews:');
    console.log('='.repeat(70));
    reviews.forEach((r: any, index: number) => {
      const citySlug = r.venue?.city?.slug?.current || 'sin-ciudad';
      const venueSlug = r.venue?.slug?.current || 'sin-venue';
      const reviewSlug = r.slug?.current || r.slug || 'SIN-SLUG';
      const url = `/${citySlug}/${venueSlug}/review/${reviewSlug}`;
      const status = r.published ? '✅ PUB' : '❌ DRAFT';
      
      console.log(`\n${index + 1}. ${status} "${r.title}"`);
      console.log(`   URL: ${url}`);
      console.log(`   Venue: ${r.venue?.title} (slug: ${venueSlug})`);
      console.log(`   City: ${r.venue?.city?.title} (slug: ${citySlug})`);
      console.log(`   Review slug: ${reviewSlug}`);
      console.log(`   ID: ${r._id}`);
    });

    // 3. Check Venues
    const venues = await client.fetch(`
      *[_type == "venue"] | order(_createdAt desc) [0...5] {
        _id,
        title,
        "cityName": city->title,
        featured,
        "hasImages": count(images) > 0
      }
    `);
    console.log('\n🏪 Venues:', venues.length);
    if (venues.length > 0) {
      console.log('   Primeros 3:', venues.slice(0, 3).map((v: any) => ({
        title: v.title,
        city: v.cityName,
        featured: v.featured,
        hasImages: v.hasImages
      })));
    }

    // 4. Check Categories
    const categories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        featured
      }
    `);
    console.log('\n🏷️  Categories:', categories.length);
    if (categories.length > 0) {
      console.log('   Primeras 3:', categories.slice(0, 3).map((c: any) => ({
        title: c.title,
        featured: c.featured
      })));
    }

    // 5. Check Cities
    const cities = await client.fetch(`
      *[_type == "city"] {
        _id,
        title,
        featured
      }
    `);
    console.log('\n🌆 Cities:', cities.length);

    console.log('\n✅ Verificación completa');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSanityData();
