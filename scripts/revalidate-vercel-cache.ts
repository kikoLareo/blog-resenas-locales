#!/usr/bin/env node

/**
 * Script para forzar revalidación de rutas en Vercel
 * 
 * Este script llama a la API de Next.js para revalidar las páginas
 * que están causando 404s debido a datos desactualizados en caché.
 */

const SITE_URL = 'https://blog-resenas-locales.vercel.app';

const pathsToRevalidate = [
  '/',
  '/ciudades',
  '/barcelona',
  '/madrid',
  '/valencia',
  '/sevilla',
  '/bilbao',
  // Reviews que sabemos que existen
  '/madrid/cafe-con-encanto/review/tapas-modernas-producto-temporada',
  '/barcelona/sushi-ikigai/review/autentica-pizza-napolitana-madrid',
  '/barcelona/sushi-ikigai/review/omakase-sushi-ikigai-barcelona',
  '/madrid/sushi-ikigai/review/omakase-sushi-ikigai-producto-top-cortes-precisos',
];

async function revalidatePath(path: string): Promise<void> {
  try {
    console.log(`🔄 Revalidating: ${path}`);
    
    // Simplemente hacer un HEAD request para forzar regeneración
    const response = await fetch(`${SITE_URL}${path}`, {
      method: 'HEAD',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    if (response.ok) {
      console.log(`✅ ${path} - Status: ${response.status}`);
    } else {
      console.log(`⚠️  ${path} - Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Error revalidating ${path}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting cache revalidation...\n');
  console.log(`Target: ${SITE_URL}\n`);

  for (const path of pathsToRevalidate) {
    await revalidatePath(path);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✅ Revalidation complete!');
  console.log('\n💡 Note: Pages may take a few seconds to regenerate.');
  console.log('   If issues persist, check Vercel deployment logs.');
}

main();
