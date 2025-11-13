// Script para arreglar los slugs de las reseñas para mejor SEO
require('dotenv').config({ path: '.env.local' });
const { adminSanityClient, adminSanityWriteClient } = require('../lib/admin-sanity.ts');

// Función para generar slug SEO-friendly
function generateSEOSlug(title, venueName) {
  // Limpiar y normalizar texto
  const cleanTitle = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^\w\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-'); // Espacios a guiones
  
  const cleanVenue = venueName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  
  // Tomar las primeras 3-4 palabras más importantes del título
  const titleWords = cleanTitle.split('-').slice(0, 4);
  const venueWords = cleanVenue.split('-').slice(0, 2);
  
  return [...venueWords, ...titleWords].join('-');
}

async function fixReviewSlugs() {
  try {
    console.log('🔧 Arreglando slugs de reseñas para mejor SEO...');
    
    // Obtener todas las reseñas existentes
    const reviews = await adminSanityClient.fetch(`
      *[_type == "review"] {
        _id,
        title,
        slug,
        venue->{title, slug}
      }
    `);

    console.log(`📝 Encontradas ${reviews.length} reseñas para arreglar`);

    for (const review of reviews) {
      if (!review.venue) {
        console.warn(`   ⚠️  Reseña sin venue: ${review.title}`);
        continue;
      }

      // Generar nuevo slug SEO-friendly
      const newSlug = generateSEOSlug(review.title, review.venue.title);
      
      // Verificar que el slug no exista ya
      const existingWithSlug = await adminSanityClient.fetch(
        '*[_type == "review" && slug.current == $slug && _id != $id][0]',
        { slug: newSlug, id: review._id }
      );

      let finalSlug = newSlug;
      if (existingWithSlug) {
        finalSlug = `${newSlug}-${Math.random().toString(36).substr(2, 3)}`;
        console.log(`   ⚠️  Slug duplicado, usando: ${finalSlug}`);
      }

      // Actualizar el slug
      await adminSanityWriteClient.patch(review._id)
        .set({
          slug: { current: finalSlug }
        })
        .commit();

      console.log(`   ✓ ${review.title}`);
      console.log(`     Antes: ${review.slug.current}`);
      console.log(`     Ahora: ${finalSlug}`);
      console.log('');
    }

    console.log('🎉 ¡Slugs arreglados para mejor SEO!');
    
    // Mostrar ejemplos de los nuevos slugs
    console.log('\n📋 Ejemplos de URLs SEO-friendly:');
    const updatedReviews = await adminSanityClient.fetch(`
      *[_type == "review"] | order(_createdAt desc) [0...3] {
        title,
        slug,
        venue->{title, city->{title, slug}}
      }
    `);
    
    updatedReviews.forEach(review => {
      const url = `/${review.venue.city.slug.current}/${review.venue.title.toLowerCase().replace(/\s+/g, '-')}/resena/${review.slug.current}`;
      console.log(`   🔗 ${url}`);
    });

  } catch (error) {
    console.error('❌ Error arreglando slugs:', error);
    process.exit(1);
  }
}

fixReviewSlugs();