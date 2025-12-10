
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../sanity/env';

const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  console.log('Fetching cities...');
  const cities = await client.fetch(`
    *[_type == "city"] {
      _id,
      title,
      "slug": slug.current
    }
  `);
  cities.forEach((city: any) => {
    console.log(`City: ${city.title}, Slug: ${city.slug}, ID: ${city._id}`);
  });

  console.log('\nFetching venues in Coruña (coru-a)...');
  const venues = await client.fetch(`
    *[_type == "venue" && city->slug.current == "coru-a"] {
      _id,
      title,
      "slug": slug.current
    }
  `);
  venues.forEach((venue: any) => {
    console.log(`Venue to move: ${venue.title}, ID: ${venue._id}`);
  });
}

main().catch(console.error);
