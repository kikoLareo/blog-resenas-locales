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

    // 2. Check Reviews
    const reviews = await client.fetch(`
      *[_type == "review" && published == true] | order(publishedAt desc) [0...5] {
        _id,
        title,
        "venueName": venue->title,
        "cityName": venue->city->title,
        featured,
        trending,
        ratings
      }
    `);
    console.log('\n📝 Reviews publicadas:', reviews.length);
    if (reviews.length > 0) {
      console.log('   Primeras 3:', reviews.slice(0, 3).map((r: any) => ({
        title: r.title,
        venue: r.venueName,
        city: r.cityName,
        featured: r.featured,
        trending: r.trending
      })));
    }

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
