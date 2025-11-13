// Script para importar datos completos - Borra existentes y crea nuevos
require('dotenv').config({ path: '.env.local' });
const { adminSanityClient, adminSanityWriteClient } = require('../lib/admin-sanity.ts');
const fs = require('fs');

async function importData(jsonFilePath) {
  try {
    console.log('🔄 Iniciando importación completa de datos...');
    
    // Leer archivo JSON
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    // PASO 1: Borrar todos los datos existentes
    console.log('🗑️  Eliminando datos existentes...');
    
    // Primero eliminar reviews que referencian venues
    const existingReviews = await adminSanityClient.fetch('*[_type == "review"]._id');
    console.log(`   - Eliminando ${existingReviews.length} reseñas existentes`);
    for (const id of existingReviews) {
      try {
        await adminSanityWriteClient.delete(id);
      } catch (error) {
        console.log(`     ⚠️  No se pudo eliminar reseña ${id}: ${error.message}`);
      }
    }

    // Eliminar otros documentos que puedan referenciar venues
    const existingQRCodes = await adminSanityClient.fetch('*[_type == "qrCode"]._id');
    console.log(`   - Eliminando ${existingQRCodes.length} códigos QR existentes`);
    for (const id of existingQRCodes) {
      try {
        await adminSanityWriteClient.delete(id);
      } catch (error) {
        console.log(`     ⚠️  No se pudo eliminar QR ${id}: ${error.message}`);
      }
    }
    
    // Ahora eliminar venues
    const existingVenues = await adminSanityClient.fetch('*[_type == "venue"]._id');
    console.log(`   - Eliminando ${existingVenues.length} venues existentes`);
    for (const id of existingVenues) {
      try {
        await adminSanityWriteClient.delete(id);
      } catch (error) {
        console.log(`     ⚠️  No se pudo eliminar venue ${id}: ${error.message}`);
      }
    }
    
    // Eliminar cities
    const existingCities = await adminSanityClient.fetch('*[_type == "city"]._id');
    console.log(`   - Eliminando ${existingCities.length} ciudades existentes`);
    for (const id of existingCities) {
      await adminSanityWriteClient.delete(id);
    }
    
    // Eliminar categories
    const existingCategories = await adminSanityClient.fetch('*[_type == "category"]._id');
    console.log(`   - Eliminando ${existingCategories.length} categorías existentes`);
    for (const id of existingCategories) {
      await adminSanityWriteClient.delete(id);
    }
    
    console.log('✅ Datos existentes eliminados');
    
    // PASO 2: Crear ciudades
    console.log('🏙️  Creando ciudades...');
    const cityMap = {};
    
    for (const cityData of jsonData.cities || []) {
      const city = await adminSanityWriteClient.create({
        _type: 'city',
        title: cityData.title,
        slug: { current: cityData.slug },
        region: cityData.region,
        description: cityData.description,
        geo: cityData.geo,
        population: cityData.population,
        timezone: cityData.timezone,
        featured: cityData.featured || false
      });
      
      cityMap[cityData.slug] = city._id;
      console.log(`   ✓ ${cityData.title} (${city._id})`);
    }
    
    // PASO 3: Crear categorías
    console.log('🏷️  Creando categorías...');
    const categoryMap = {};
    
    for (const catData of jsonData.categories || []) {
      const category = await adminSanityWriteClient.create({
        _type: 'category',
        title: catData.title,
        slug: { current: catData.slug },
        description: catData.description,
        icon: catData.icon,
        color: catData.color
      });
      
      categoryMap[catData.slug] = category._id;
      console.log(`   ✓ ${catData.title} (${category._id})`);
    }
    
    // PASO 4: Crear venues
    console.log('🏪 Creando venues...');
    
    for (const venueData of jsonData.venues || []) {
      // Resolver referencias
      const cityRef = cityMap[venueData.city_slug];
      if (!cityRef) {
        console.error(`   ❌ Ciudad no encontrada: ${venueData.city_slug}`);
        continue;
      }
      
      const categoryRefs = (venueData.category_slugs || []).map(slug => {
        const catRef = categoryMap[slug];
        if (!catRef) {
          console.warn(`   ⚠️  Categoría no encontrada: ${slug}`);
          return null;
        }
        return { _type: 'reference', _ref: catRef };
      }).filter(Boolean);
      
      // Procesar imágenes (por ahora como URLs, después se pueden subir como assets)
      const processedImages = (venueData.images || []).map(img => ({
        _type: 'image',
        alt: img.alt,
        caption: img.caption,
        // Nota: Para imágenes reales, necesitarías subirlas como assets primero
        asset: {
          _type: 'reference',
          _ref: 'image-placeholder' // Placeholder por ahora
        }
      }));
      
      const venue = await adminSanityWriteClient.create({
        _type: 'venue',
        title: venueData.title,
        slug: { current: venueData.slug },
        city: { _type: 'reference', _ref: cityRef },
        address: venueData.address,
        postalCode: venueData.postalCode,
        phone: venueData.phone,
        website: venueData.website,
        geo: venueData.geo,
        openingHours: venueData.openingHours,
        priceRange: venueData.priceRange,
        categories: categoryRefs,
        description: venueData.description,
        social: venueData.social,
        // images: processedImages, // Comentado hasta procesar assets reales
      });
      
      console.log(`   ✓ ${venueData.title} (${venue._id})`);
    }
    
    console.log('🎉 Importación completada exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - ${jsonData.cities?.length || 0} ciudades creadas`);
    console.log(`   - ${jsonData.categories?.length || 0} categorías creadas`);
    console.log(`   - ${jsonData.venues?.length || 0} venues creados`);
    
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    throw error;
  }
}

// Usar como: node scripts/import-data.js data.json
const jsonFilePath = process.argv[2];
if (!jsonFilePath) {
  console.error('❌ Uso: node scripts/import-data.js <archivo.json>');
  process.exit(1);
}

importData(jsonFilePath);