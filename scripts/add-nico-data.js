// Script para añadir datos de Nico sin borrar los existentes
require('dotenv').config({ path: '.env.local' });
const { adminSanityClient, adminSanityWriteClient } = require('../lib/admin-sanity.ts');
const fs = require('fs');

async function addNicoData(jsonFilePath) {
  try {
    console.log('🔄 Iniciando importación de datos de Nico Clouston...');
    
    // Leer archivo JSON
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    // PASO 1: Crear ciudades (si no existen)
    console.log('🏙️  Procesando ciudades...');
    const cityMap = {};
    
    for (const cityData of jsonData.cities || []) {
      // Verificar si la ciudad ya existe
      const existingCity = await adminSanityClient.fetch(
        '*[_type == "city" && slug.current == $slug][0]',
        { slug: cityData.slug }
      );
      
      let city;
      if (existingCity) {
        console.log(`   ↻ ${cityData.title} ya existe, actualizando...`);
        city = await adminSanityWriteClient.createOrReplace({
          _id: existingCity._id,
          _type: 'city',
          title: cityData.title,
          slug: { current: cityData.slug },
          region: cityData.region,
          description: cityData.description,
          geo: cityData.geo,
          population: cityData.population,
          timezone: cityData.timezone,
          featured: cityData.featured
        });
      } else {
        console.log(`   ✓ Creando ${cityData.title}...`);
        city = await adminSanityWriteClient.create({
          _type: 'city',
          title: cityData.title,
          slug: { current: cityData.slug },
          region: cityData.region,
          description: cityData.description,
          geo: cityData.geo,
          population: cityData.population,
          timezone: cityData.timezone,
          featured: cityData.featured
        });
      }
      
      cityMap[cityData.slug] = city._id;
    }
    
    // PASO 2: Crear categorías (si no existen)
    console.log('🏷️  Procesando categorías...');
    const categoryMap = {};
    
    for (const catData of jsonData.categories || []) {
      // Verificar si la categoría ya existe
      const existingCategory = await adminSanityClient.fetch(
        '*[_type == "category" && slug.current == $slug][0]',
        { slug: catData.slug }
      );
      
      let category;
      if (existingCategory) {
        console.log(`   ↻ ${catData.title} ya existe, actualizando...`);
        category = await adminSanityWriteClient.createOrReplace({
          _id: existingCategory._id,
          _type: 'category',
          title: catData.title,
          slug: { current: catData.slug },
          description: catData.description,
          icon: catData.icon,
          color: catData.color
        });
      } else {
        console.log(`   ✓ Creando ${catData.title}...`);
        category = await adminSanityWriteClient.create({
          _type: 'category',
          title: catData.title,
          slug: { current: catData.slug },
          description: catData.description,
          icon: catData.icon,
          color: catData.color
        });
      }
      
      categoryMap[catData.slug] = category._id;
    }
    
    // PASO 3: Crear venues (si no existen)
    console.log('🏪 Procesando venues...');
    
    for (const venueData of jsonData.venues || []) {
      // Verificar si el venue ya existe
      const existingVenue = await adminSanityClient.fetch(
        '*[_type == "venue" && slug.current == $slug][0]',
        { slug: venueData.slug }
      );
      
      // Verificar que la ciudad existe
      if (!cityMap[venueData.city_slug]) {
        console.error(`   ❌ Ciudad no encontrada: ${venueData.city_slug}`);
        continue;
      }
      
      // Crear referencias a categorías
      const categoryRefs = venueData.category_slugs?.map(slug => {
        if (!categoryMap[slug]) {
          console.warn(`   ⚠️  Categoría no encontrada: ${slug}`);
          return null;
        }
        return {
          _type: 'reference',
          _ref: categoryMap[slug]
        };
      }).filter(Boolean) || [];
      
      const venueDoc = {
        _type: 'venue',
        title: venueData.title,
        slug: { current: venueData.slug },
        city: {
          _type: 'reference',
          _ref: cityMap[venueData.city_slug]
        },
        address: venueData.address,
        postalCode: venueData.postalCode,
        phone: venueData.phone,
        website: venueData.website,
        geo: venueData.geo,
        openingHours: venueData.openingHours,
        priceRange: venueData.priceRange,
        categories: categoryRefs,
        description: venueData.description,
        social: {
          instagram: venueData.social?.instagram || '',
          facebook: venueData.social?.facebook || '',
          twitter: venueData.social?.twitter || '',
          tiktok: venueData.social?.tiktok || ''
        }
      };
      
      if (existingVenue) {
        console.log(`   ↻ ${venueData.title} ya existe, actualizando...`);
        await adminSanityWriteClient.createOrReplace({
          _id: existingVenue._id,
          ...venueDoc
        });
      } else {
        console.log(`   ✓ Creando ${venueData.title}...`);
        await adminSanityWriteClient.create(venueDoc);
      }
    }
    
    console.log('🎉 Importación de datos de Nico completada exitosamente!');
    console.log(`   📊 Procesadas: ${jsonData.cities?.length || 0} ciudades, ${jsonData.categories?.length || 0} categorías, ${jsonData.venues?.length || 0} venues`);
    
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    process.exit(1);
  }
}

// Ejecutar si se pasa un archivo como argumento
if (process.argv[2]) {
  addNicoData(process.argv[2]);
} else {
  console.error('❌ Uso: node add-nico-data.js <archivo.json>');
  process.exit(1);
}