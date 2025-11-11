// Script para crear datos de prueba
require('dotenv').config({ path: '.env.local' });
const { adminSanityClient, adminSanityWriteClient } = require('../lib/admin-sanity.ts');

async function createTestData() {
  try {
    console.log('🔍 Verificando datos existentes...');
    
    // Verificar ciudades existentes
    const cities = await adminSanityClient.fetch('*[_type == "city"] { _id, title, "slug": slug.current }');
    console.log(`📍 Ciudades encontradas: ${cities.length}`);
    cities.forEach(city => console.log(`  - ${city.title} (${city.slug})`));
    
    // Verificar venues existentes
    const venues = await adminSanityClient.fetch(`
      *[_type == "venue"] { 
        _id, 
        title, 
        "slug": slug.current, 
        city-> { title, "slug": slug.current } 
      }
    `);
    console.log(`🏪 Venues encontrados: ${venues.length}`);
    venues.forEach(venue => console.log(`  - ${venue.title} (${venue.slug}) en ${venue.city?.title || 'sin ciudad'}`));
    
    // Si no hay Madrid, crear la ciudad
    let madridCity = cities.find(c => c.slug === 'madrid');
    if (!madridCity) {
      console.log('➕ Creando ciudad Madrid...');
      madridCity = await adminSanityWriteClient.create({
        _type: 'city',
        title: 'Madrid',
        slug: { current: 'madrid' },
        region: 'Madrid',
        description: 'La capital de España',
        geo: {
          lat: 40.4168,
          lng: -3.7038
        },
        population: 3223334,
        timezone: 'Europe/Madrid',
        featured: true
      });
      console.log(`✅ Ciudad Madrid creada: ${madridCity._id}`);
    }
    
    // Si no existe Casa Mingo Madrid, crearlo
    let casaMingo = venues.find(v => v.slug === 'casa-mingo-madrid');
    if (!casaMingo) {
      console.log('➕ Creando Casa Mingo Madrid...');
      casaMingo = await adminSanityWriteClient.create({
        _type: 'venue',
        title: 'Casa Mingo Madrid',
        slug: { current: 'casa-mingo-madrid' },
        description: 'Tradicional sidrería madrileña desde 1888, famosa por su pollo asado y sidra natural.',
        address: 'Paseo de la Florida, 34',
        postalCode: '28008',
        phone: '+34 915 477 918',
        city: { _type: 'reference', _ref: madridCity._id },
        geo: {
          lat: 40.4251,
          lng: -3.7249
        },
        openingHours: 'Lun-Dom: 11:00-01:00',
        priceRange: '€€ (20-30€)',
        website: 'https://www.casamingo.es',
        schemaType: 'Restaurant'
      });
      console.log(`✅ Casa Mingo Madrid creado: ${casaMingo._id}`);
    }
    
    console.log('🎉 Datos de prueba verificados/creados exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

createTestData();