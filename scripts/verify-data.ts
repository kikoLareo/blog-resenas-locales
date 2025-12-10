import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // We want fresh data
  apiVersion: '2023-05-03',
});

async function verifyData() {
  console.log('Verifying seeded data...');

  const cities = await client.fetch(`*[_type == "city"]{title}`);
  console.log(`Cities found: ${cities.length}`);
  cities.forEach((c: any) => console.log(` - ${c.title}`));

  const categories = await client.fetch(`*[_type == "category"]{title}`);
  console.log(`Categories found: ${categories.length}`);
  categories.forEach((c: any) => console.log(` - ${c.title}`));

  const venues = await client.fetch(`*[_type == "venue"]{title, city->{title}}`);
  console.log(`Venues found: ${venues.length}`);
  venues.forEach((v: any) => console.log(` - ${v.title} (${v.city?.title})`));

  const reviews = await client.fetch(`*[_type == "review"]{title, venue->{title}}`);
  console.log(`Reviews found: ${reviews.length}`);
  reviews.forEach((r: any) => console.log(` - ${r.title} (Venue: ${r.venue?.title})`));
}

verifyData().catch(console.error);
