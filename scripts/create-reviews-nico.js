// Script para crear reseñas de ejemplo para los locales de Nico
require('dotenv').config({ path: '.env.local' });
const { adminSanityClient, adminSanityWriteClient } = require('../lib/admin-sanity.ts');

async function createReviewsForNico() {
  try {
    console.log('🔄 Creando reseñas para los locales de Nico...');
    
    // Obtener los locales de Galicia que acabamos de importar
    const galegosVenues = await adminSanityClient.fetch(`
      *[_type == "venue" && city->slug.current in ["a-coruna", "arteixo", "oleiros", "santiago-de-compostela"]] {
        _id,
        title,
        slug,
        categories[]->{slug, title},
        city->{title, slug}
      }
    `);

    console.log(`📍 Encontrados ${galegosVenues.length} locales gallegos`);

    const reseñasTemplate = [
      // Picoteo A Coruña - Gastronomía
      {
        venue: 'picoteo-coruna',
        title: 'Un local familiar con mucho encanto',
        content: `Pequeño local familiar reformado con muy buen gusto. El ambiente es acogedor y la comida está buenísima. Perfecto para tomar algo en A Coruña. Lo recomiendan por algo.`,
        author: 'María González',
        rating: 4.5,
        reviewType: 'gastronomia',
        ratings: {
          food: 5,
          service: 4,
          atmosphere: 5,
          value: 4
        }
      },

      // Auga de Maio Spa - Ocio
      {
        venue: 'auga-de-maio-coruna',
        title: 'Relajación total en pleno centro',
        content: `Spa urbano recién inaugurado que es una maravilla. Los circuitos de agua están geniales y los masajes son increíbles. Perfecto para desconectar del estrés.`,
        author: 'Carmen Rodríguez',
        rating: 5.0,
        reviewType: 'ocio',
        ratings: {
          facilities: 5,
          service: 5,
          atmosphere: 5,
          value: 4
        }
      },

      // La Conquista Cocina Peruana - Gastronomía
      {
        venue: 'la-conquista-cocina-peruana',
        title: 'Auténtica cocina peruana en A Coruña',
        content: `Sabores que conquistan de verdad. Los ceviches están espectaculares y los pisco sours son adictivos. Un pedacito del Perú en Galicia.`,
        author: 'Pedro Martínez',
        rating: 4.8,
        reviewType: 'gastronomia',
        ratings: {
          food: 5,
          service: 5,
          atmosphere: 4,
          value: 5
        }
      },

      // Milá Milanesería - Gastronomía
      {
        venue: 'mila-milaneseria-arteixo',
        title: 'Las mejores milanesas fuera de Argentina',
        content: `Proyecto familiar que trae la auténtica milanesa argentina a Galicia. Las empanadas también están buenísimas y el trato es súper cercano.`,
        author: 'Lucas Silva',
        rating: 4.7,
        reviewType: 'gastronomia',
        ratings: {
          food: 5,
          service: 5,
          atmosphere: 4,
          value: 4
        }
      },

      // Urban Planet Jump - Deportes
      {
        venue: 'urban-planet-oleiros',
        title: 'Diversión asegurada para toda la familia',
        content: `Parque de trampolines genial para pasar una tarde diferente. Las instalaciones están muy bien y es perfecto para hacer ejercicio divirtiéndote.`,
        author: 'Ana Fernández',
        rating: 4.3,
        reviewType: 'deportes',
        ratings: {
          facilities: 4,
          safety: 5,
          staff: 4,
          value: 4
        }
      },

      // Vazva Calle Real - Ocio
      {
        venue: 'vazva-calle-real-coruna',
        title: 'Referente del skate en A Coruña',
        content: `La tienda de skate más auténtica de la ciudad. Marcas core como Dickies y Real Skateboards. El espacio renovado está genial y el personal sabe mucho.`,
        author: 'Javi Skateboard',
        rating: 4.6,
        reviewType: 'ocio',
        ratings: {
          selection: 5,
          service: 4,
          atmosphere: 5,
          value: 4
        }
      },

      // Cometta A Coruña - Gastronomía
      {
        venue: 'cometta-coruna',
        title: 'Italiana moderna y de calidad',
        content: `Estética minimalista y moderna con comida italiana de verdad. Las pizzas artesanales están buenísimas y los desayunos también son top.`,
        author: 'Elena Torres',
        rating: 4.4,
        reviewType: 'gastronomia',
        ratings: {
          food: 4,
          service: 4,
          atmosphere: 5,
          value: 4
        }
      },

      // Amorino A Coruña - Gastronomía
      {
        venue: 'amorino-coruna',
        title: 'Los mejores helados artesanales',
        content: `Heladería italiana que está a otro nivel. Los helados en forma de flor son una obra de arte y saben increíble. Los macarons también están buenísimos.`,
        author: 'Sara López',
        rating: 4.9,
        reviewType: 'gastronomia',
        ratings: {
          food: 5,
          service: 5,
          atmosphere: 5,
          value: 4
        }
      }
    ];

    // Crear las reseñas
    let created = 0;
    for (const reviewData of reseñasTemplate) {
      // Buscar el venue por slug
      const venue = galegosVenues.find(v => v.slug.current === reviewData.venue);
      
      if (!venue) {
        console.warn(`   ⚠️  Local no encontrado: ${reviewData.venue}`);
        continue;
      }

      const review = await adminSanityWriteClient.create({
        _type: 'review',
        title: reviewData.title,
        slug: { current: `${reviewData.venue}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
        venue: {
          _type: 'reference',
          _ref: venue._id
        },
        content: reviewData.content,
        author: reviewData.author,
        rating: reviewData.rating,
        reviewType: reviewData.reviewType,
        ratings: reviewData.ratings,
        featured: Math.random() > 0.7, // 30% de probabilidad de ser destacada
        publishedAt: new Date().toISOString()
      });

      console.log(`   ✓ Creada reseña para ${venue.title}: "${reviewData.title}"`);
      created++;
    }

    console.log(`🎉 ¡${created} reseñas creadas exitosamente!`);
    console.log('📍 Tipos de reseñas creadas:');
    const gastronomia = reseñasTemplate.filter(r => r.reviewType === 'gastronomia').length;
    const ocio = reseñasTemplate.filter(r => r.reviewType === 'ocio').length;
    const deportes = reseñasTemplate.filter(r => r.reviewType === 'deportes').length;
    
    console.log(`   🍽️  Gastronomía: ${gastronomia}`);
    console.log(`   🎭 Ocio: ${ocio}`);
    console.log(`   💪 Deportes: ${deportes}`);

  } catch (error) {
    console.error('❌ Error creando reseñas:', error);
    process.exit(1);
  }
}

createReviewsForNico();