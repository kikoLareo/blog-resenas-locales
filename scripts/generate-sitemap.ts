#!/usr/bin/env tsx
/**
 * Script para generar sitemap.xml dinámico
 * Obtiene datos de Sanity CMS y genera sitemap optimizado para SEO
 * 
 * Uso:
 * npm run generate-sitemap
 * o
 * npx tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@sanity/client';
import type { Review, Category, City } from '../lib/types';

// =============================================
// CONFIGURACIÓN
// =============================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
const OUTPUT_DIR = join(process.cwd(), 'public');

// Cliente de Sanity
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Para datos más frescos
  token: process.env.SANITY_API_READ_TOKEN, // Opcional para contenido privado
});

// =============================================
// QUERIES GROQ
// =============================================

const REVIEWS_QUERY = `
  *[_type == "review" && !(_id in path("drafts.**"))] {
    _id,
    _updatedAt,
    slug,
    venue {
      city -> {
        slug
      }
    }
  }
`;

const CATEGORIES_QUERY = `
  *[_type == "category" && !(_id in path("drafts.**"))] {
    _id,
    _updatedAt,
    slug
  }
`;

const CITIES_QUERY = `
  *[_type == "city" && !(_id in path("drafts.**"))] {
    _id,
    _updatedAt,
    slug
  }
`;

// =============================================
// TIPOS DE CONTENIDO Y CONFIGURACIÓN SEO
// =============================================

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

const STATIC_PAGES: SitemapUrl[] = [
  {
    loc: `${SITE_URL}/`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: '1.0',
  },
  {
    loc: `${SITE_URL}/blog`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: '0.9',
  },
  {
    loc: `${SITE_URL}/categorias`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    loc: `${SITE_URL}/tags`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: '0.7',
  },
];

// =============================================
// FUNCIONES AUXILIARES
// =============================================

/**
 * Formatea fecha para sitemap
 */
function formatDate(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

/**
 * Genera XML del sitemap
 */
function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlsXML = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlsXML}
</urlset>`;
}

/**
 * Genera sitemap index (para múltiples sitemaps)
 */
function generateSitemapIndex(sitemaps: { loc: string; lastmod: string }[]): string {
  const sitemapsXML = sitemaps
    .map(
      (sitemap) => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXML}
</sitemapindex>`;
}

// =============================================
// FUNCIONES PRINCIPALES
// =============================================

/**
 * Obtiene todas las reseñas
 */
async function getReviews(): Promise<SitemapUrl[]> {
  try {
    const reviews = await sanityClient.fetch(REVIEWS_QUERY);
    
    return reviews.map((review: any) => ({
      loc: `${SITE_URL}/blog/${review.venue?.city?.slug || 'general'}/${review.slug.current}`,
      lastmod: formatDate(review._updatedAt),
      changefreq: 'monthly' as const,
      priority: '0.8',
    }));
  } catch (error) {
    console.error('Error obteniendo reseñas:', error);
    return [];
  }
}

/**
 * Obtiene todas las categorías
 */
async function getCategories(): Promise<SitemapUrl[]> {
  try {
    const categories = await sanityClient.fetch(CATEGORIES_QUERY);
    
    return categories.map((category: any) => ({
      loc: `${SITE_URL}/categorias/${category.slug.current}`,
      lastmod: formatDate(category._updatedAt),
      changefreq: 'weekly' as const,
      priority: '0.7',
    }));
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return [];
  }
}

/**
 * Obtiene todas las ciudades
 */
async function getCities(): Promise<SitemapUrl[]> {
  try {
    const cities = await sanityClient.fetch(CITIES_QUERY);
    
    return cities.map((city: any) => ({
      loc: `${SITE_URL}/blog/${city.slug.current}`,
      lastmod: formatDate(city._updatedAt),
      changefreq: 'weekly' as const,
      priority: '0.6',
    }));
  } catch (error) {
    console.error('Error obteniendo ciudades:', error);
    return [];
  }
}

/**
 * Genera sitemap principal
 */
async function generateMainSitemap(): Promise<void> {
  console.log('🚀 Generando sitemap principal...');
  
  try {
    // Obtener datos dinámicos
    const [reviews, categories, cities] = await Promise.all([
      getReviews(),
      getCategories(),
      getCities(),
    ]);

    // Combinar todas las URLs
    const allUrls = [...STATIC_PAGES, ...reviews, ...categories, ...cities];

    // Ordenar por prioridad y fecha
    allUrls.sort((a, b) => {
      if (a.priority !== b.priority) {
        return parseFloat(b.priority) - parseFloat(a.priority);
      }
      return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime();
    });

    // Generar XML
    const sitemapXML = generateSitemapXML(allUrls);

    // Escribir archivo
    const sitemapPath = join(OUTPUT_DIR, 'sitemap.xml');
    writeFileSync(sitemapPath, sitemapXML, 'utf-8');

    console.log(`✅ Sitemap generado: ${sitemapPath}`);
    console.log(`📊 URLs incluidas: ${allUrls.length}`);
    console.log(`   - Páginas estáticas: ${STATIC_PAGES.length}`);
    console.log(`   - Reseñas: ${reviews.length}`);
    console.log(`   - Categorías: ${categories.length}`);
    console.log(`   - Ciudades: ${cities.length}`);
  } catch (error) {
    console.error('❌ Error generando sitemap principal:', error);
    throw error;
  }
}

/**
 * Genera sitemaps separados (opcional para sitios grandes)
 */
async function generateSeparateSitemaps(): Promise<void> {
  console.log('🚀 Generando sitemaps separados...');
  
  try {
    const [reviews, categories, cities] = await Promise.all([
      getReviews(),
      getCategories(),
      getCities(),
    ]);

    const sitemaps = [];
    const currentDate = new Date().toISOString();

    // Sitemap de páginas estáticas
    if (STATIC_PAGES.length > 0) {
      const staticXML = generateSitemapXML(STATIC_PAGES);
      const staticPath = join(OUTPUT_DIR, 'sitemap-static.xml');
      writeFileSync(staticPath, staticXML, 'utf-8');
      sitemaps.push({
        loc: `${SITE_URL}/sitemap-static.xml`,
        lastmod: currentDate,
      });
      console.log(`✅ Sitemap estático: ${staticPath} (${STATIC_PAGES.length} URLs)`);
    }

    // Sitemap de reseñas
    if (reviews.length > 0) {
      const reviewsXML = generateSitemapXML(reviews);
      const reviewsPath = join(OUTPUT_DIR, 'sitemap-posts.xml');
      writeFileSync(reviewsPath, reviewsXML, 'utf-8');
      sitemaps.push({
        loc: `${SITE_URL}/sitemap-posts.xml`,
        lastmod: currentDate,
      });
      console.log(`✅ Sitemap de reseñas: ${reviewsPath} (${reviews.length} URLs)`);
    }

    // Sitemap de categorías
    if (categories.length > 0) {
      const categoriesXML = generateSitemapXML(categories);
      const categoriesPath = join(OUTPUT_DIR, 'sitemap-categories.xml');
      writeFileSync(categoriesPath, categoriesXML, 'utf-8');
      sitemaps.push({
        loc: `${SITE_URL}/sitemap-categories.xml`,
        lastmod: currentDate,
      });
      console.log(`✅ Sitemap de categorías: ${categoriesPath} (${categories.length} URLs)`);
    }

    // Sitemap de ciudades
    if (cities.length > 0) {
      const citiesXML = generateSitemapXML(cities);
      const citiesPath = join(OUTPUT_DIR, 'sitemap-cities.xml');
      writeFileSync(citiesPath, citiesXML, 'utf-8');
      sitemaps.push({
        loc: `${SITE_URL}/sitemap-cities.xml`,
        lastmod: currentDate,
      });
      console.log(`✅ Sitemap de ciudades: ${citiesPath} (${cities.length} URLs)`);
    }

    // Generar índice de sitemaps
    if (sitemaps.length > 1) {
      const indexXML = generateSitemapIndex(sitemaps);
      const indexPath = join(OUTPUT_DIR, 'sitemap-index.xml');
      writeFileSync(indexPath, indexXML, 'utf-8');
      console.log(`✅ Índice de sitemaps: ${indexPath} (${sitemaps.length} sitemaps)`);
    }
  } catch (error) {
    console.error('❌ Error generando sitemaps separados:', error);
    throw error;
  }
}

/**
 * Genera robots.txt dinámico (opcional)
 */
function generateRobotsTxt(): void {
  const robotsContent = `# Robots.txt generado automáticamente
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-index.xml

# Áreas bloqueadas
Disallow: /studio/
Disallow: /api/
Disallow: /_next/static/chunks/

# Última actualización: ${new Date().toISOString()}
`;

  const robotsPath = join(OUTPUT_DIR, 'robots-generated.txt');
  writeFileSync(robotsPath, robotsContent, 'utf-8');
  console.log(`✅ Robots.txt generado: ${robotsPath}`);
}

// =============================================
// FUNCIÓN PRINCIPAL
// =============================================

async function main(): Promise<void> {
  console.log('🔄 Iniciando generación de sitemaps...');
  console.log(`📍 URL del sitio: ${SITE_URL}`);
  console.log(`📂 Directorio de salida: ${OUTPUT_DIR}`);
  
  try {
    // Verificar variables de entorno
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID no está configurado');
    }

    const startTime = Date.now();

    // Generar sitemap principal
    await generateMainSitemap();

    // Opcionalmente generar sitemaps separados para sitios grandes
    const shouldGenerateSeparate = process.argv.includes('--separate');
    if (shouldGenerateSeparate) {
      await generateSeparateSitemaps();
    }

    // Opcionalmente generar robots.txt dinámico
    const shouldGenerateRobots = process.argv.includes('--robots');
    if (shouldGenerateRobots) {
      generateRobotsTxt();
    }

    const duration = Date.now() - startTime;
    console.log(`🎉 ¡Generación completada en ${duration}ms!`);
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Verificar los archivos generados en /public/');
    console.log('2. Subir a Google Search Console');
    console.log('3. Configurar regeneración automática en CI/CD');
    console.log('4. Monitorear indexación en GSC');

  } catch (error) {
    console.error('❌ Error en la generación:', error);
    process.exit(1);
  }
}

// =============================================
// EJECUCIÓN
// =============================================

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

export {
  generateMainSitemap,
  generateSeparateSitemaps,
  generateRobotsTxt,
  main as generateSitemap,
};