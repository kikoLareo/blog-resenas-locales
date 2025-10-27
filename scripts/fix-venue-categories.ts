import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Mapeo de venues a categorías
const venueCategoryMapping: Record<string, string[]> = {
  'cafe-con-encanto': ['cafe', 'brunch'],
  'casa-de-la-paella': ['paella', 'valenciana'],
  'pizzeria-tradizionale': ['italiana', 'pizza'],
  'ramen-neko': ['japonesa', 'ramen'],
  'restaurant-x': ['restaurante', 'moderna'],
  'sushi-ikigai': ['japonesa', 'sushi'],
};

async function fixVenueCategories() {
  console.log('🔧 Fixing venue categories...\n');
  
  // 1. Obtener todas las categorías disponibles
  const allCategories = await client.fetch<Array<{ _id: string; title: string; slug: { current: string } }>>(
    `*[_type == "category"]{ _id, title, slug }`
  );
  
  console.log(`📋 Available categories: ${allCategories.length}\n`);
  allCategories.forEach(cat => {
    console.log(`   - ${cat.title} (${cat.slug.current})`);
  });
  console.log('');
  
  // 2. Obtener venues sin categorías
  const venues = await client.fetch<Array<{
    _id: string;
    title: string;
    slug: { current: string };
    categories: any;
  }>>(`
    *[_type == "venue" && (!defined(categories) || count(categories) == 0)]{
      _id,
      title,
      slug,
      categories
    }
  `);
  
  console.log(`⚠️  Found ${venues.length} venues without categories\n`);
  
  // 3. Asignar categoría por defecto a todos
  const defaultCategory = allCategories.find(c => 
    c.slug.current === 'cocina-internacional' || 
    c.slug.current === 'internacional' ||
    c.title.toLowerCase().includes('internacional')
  ) || allCategories[0]; // Usar la primera categoría si no se encuentra
  
  if (!defaultCategory) {
    console.error('❌ No se encontraron categorías disponibles');
    return;
  }
  
  console.log(`✅ Using default category: ${defaultCategory.title}\n`);
  
  // 4. Actualizar cada venue
  for (const venue of venues) {
    console.log(`📝 Updating: ${venue.title}`);
    
    try {
      await client
        .patch(venue._id)
        .set({
          categories: [
            {
              _type: 'reference',
              _ref: defaultCategory._id,
              _key: `category-${Date.now()}`
            }
          ]
        })
        .commit();
      
      console.log(`   ✅ Updated with category: ${defaultCategory.title}\n`);
    } catch (error) {
      console.error(`   ❌ Error updating ${venue.title}:`, error);
    }
  }
  
  console.log('\n🎉 All venues now have categories!');
  console.log('💡 You can update individual venue categories in Sanity Studio');
}

fixVenueCategories();
