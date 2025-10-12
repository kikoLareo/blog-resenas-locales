/**
 * Script para añadir categorías a Sanity
 */

import { createClient } from '@sanity/client';

// Configuración del cliente con token de escritura para seeds
const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: "sk5pdI1X71JKsFKbiWMFyXEiG8mOeBpze9ZsQBfxHfVMmkZmzfE5ixogDmbesz7dg4bIAqHNkDst2tJq9bv7BhE1VwIG1sJ6PK3uZhYuW0MLsqtpxzQYNQl14bOwiV17ZEhhCx6XTNy3Yjje0ViA31DU31ibKfguaZQYzcBU0vE7Kp7ZMZ3D",
  useCdn: false,
});

// Datos de categorías
const categories: any[] = [
  {
    _type: 'category',
    _id: 'cat-tapas-tradicionales',
    title: 'Tapas Tradicionales',
    slug: { current: 'tapas-tradicionales' },
    description: 'Descubre los mejores bares de tapas de Madrid con auténtica cocina española',
    color: '#f59e0b',
    emoji: '🍤',
    published: true,
    featured: true,
    seoTitle: 'Mejores Bares de Tapas Tradicionales en Madrid 2025',
    seoDescription: 'Guía completa de los mejores bares de tapas tradicionales en Madrid. Descubre la auténtica cocina española en los locales más emblemáticos.',
    seoKeywords: ['tapas tradicionales madrid', 'bares de tapas', 'cocina española', 'tapas auténticas']
  },
  {
    _type: 'category',
    _id: 'cat-cocina-internacional',
    title: 'Cocina Internacional',
    slug: { current: 'cocina-internacional' },
    description: 'Sabores del mundo en tu ciudad. Restaurantes de cocina internacional',
    color: '#ef4444',
    emoji: '🌍',
    published: true,
    featured: true,
    seoTitle: 'Mejores Restaurantes de Cocina Internacional en Madrid',
    seoDescription: 'Descubre los mejores restaurantes de cocina internacional en Madrid. Sabores auténticos de todo el mundo en tu ciudad.',
    seoKeywords: ['cocina internacional madrid', 'restaurantes extranjeros', 'comida internacional', 'sabores del mundo']
  },
  {
    _type: 'category',
    _id: 'cat-fine-dining',
    title: 'Fine Dining',
    slug: { current: 'fine-dining' },
    description: 'Experiencias gastronómicas únicas y de alta cocina',
    color: '#8b5cf6',
    emoji: '⭐',
    published: true,
    featured: true,
    seoTitle: 'Mejores Restaurantes Fine Dining en Madrid 2025',
    seoDescription: 'Los mejores restaurantes de alta cocina y fine dining en Madrid. Experiencias gastronómicas únicas y exclusivas.',
    seoKeywords: ['fine dining madrid', 'alta cocina', 'restaurantes michelin', 'experiencias gastronómicas']
  },
  {
    _type: 'category',
    _id: 'cat-brunch-cafe',
    title: 'Brunch & Café',
    slug: { current: 'brunch-cafe' },
    description: 'Los mejores sitios para desayunar, brunch y café',
    color: '#84cc16',
    emoji: '☕',
    published: true,
    featured: true,
    seoTitle: 'Mejores Cafés y Brunch en Madrid 2025',
    seoDescription: 'Descubre los mejores cafés y locales de brunch en Madrid. Desayunos perfectos y café de especialidad.',
    seoKeywords: ['brunch madrid', 'mejores cafés', 'desayunos madrid', 'café especialidad']
  },
  {
    _type: 'category',
    _id: 'cat-italiana',
    title: 'Cocina Italiana',
    slug: { current: 'cocina-italiana' },
    description: 'Auténtica cocina italiana: pasta, pizza y más',
    color: '#22c55e',
    emoji: '🍝',
    published: true,
    featured: true,
    seoTitle: 'Mejores Restaurantes Italianos en Madrid',
    seoDescription: 'Los mejores restaurantes de cocina italiana en Madrid. Pasta fresca, pizza auténtica y sabores de Italia.',
    seoKeywords: ['restaurantes italianos madrid', 'pasta fresca', 'pizza auténtica', 'cocina italiana']
  },
  {
    _type: 'category',
    _id: 'cat-japonesa',
    title: 'Cocina Japonesa',
    slug: { current: 'cocina-japonesa' },
    description: 'Sushi, ramen y auténtica cocina japonesa',
    color: '#3b82f6',
    emoji: '🍣',
    published: true,
    featured: true,
    seoTitle: 'Mejores Restaurantes Japoneses en Madrid',
    seoDescription: 'Descubre los mejores restaurantes de cocina japonesa en Madrid. Sushi fresco, ramen auténtico y más.',
    seoKeywords: ['restaurantes japoneses madrid', 'sushi fresco', 'ramen auténtico', 'cocina japonesa']
  }
];

async function seedCategories() {
  try {
    console.log('🌱 Iniciando la siembra de categorías en Sanity...');

    for (const category of categories) {
      try {
        await adminClient.createOrReplace(category);
        console.log(`✅ Categoría creada: ${category.title}`);
      } catch (error) {
        console.error(`❌ Error creando categoría ${category.title}:`, error);
      }
    }

    console.log('🎉 ¡Categorías sembradas exitosamente en Sanity!');
    console.log(`📊 Total: ${categories.length} categorías creadas`);
    console.log('✨ Proceso completado exitosamente');

  } catch (error) {
    console.error('❌ Error general en la siembra de categorías:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedCategories();
}

export { seedCategories };
