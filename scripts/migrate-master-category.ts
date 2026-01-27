import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function migrate() {
  console.log('🚀 Iniciando migración de Categoría Maestra...');

  if (!process.env.SANITY_WRITE_TOKEN && !process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_WRITE_TOKEN o SANITY_API_TOKEN no encontrado en .env.local');
    return;
  }

  // 1. Buscar locales que NO tengan masterCategory definida
  const venues = await client.fetch(`*[_type == "venue" && !defined(masterCategory)] {
    _id,
    title,
    "categories": categories[]->title
  }`);

  if (venues.length === 0) {
    console.log('✅ Todos los locales ya tienen Categoría Maestra o no se encontraron locales sin ella.');
    return;
  }

  console.log(`📝 Encontrados ${venues.length} locales para actualizar.`);

  for (const venue of venues) {
    let masterCategory = 'gastro'; // Por defecto

    const categoriesLower = (venue.categories || []).map((c: string) => c.toLowerCase());
    const titleLower = venue.title.toLowerCase();

    // Palabras clave para Ocio y Deportes
    const ocioKeywords = ['ocio', 'cine', 'teatro', 'museo', 'concierto', 'parque', 'zoo', 'acuario', 'bolera', 'escape', 'diversion', 'centro comercial'];
    const deporteKeywords = ['deporte', 'gym', 'gimnasio', 'padel', 'tenis', 'futbol', 'estadio', 'piscina', 'crossfit', 'yoga', 'entrenamiento', 'fitness'];

    if (ocioKeywords.some(k => categoriesLower.some((c: string) => c.includes(k)) || titleLower.includes(k))) {
      masterCategory = 'ocio';
    } else if (deporteKeywords.some(k => categoriesLower.some((c: string) => c.includes(k)) || titleLower.includes(k))) {
      masterCategory = 'deportes';
    }

    console.log(`   - Actualizando "${venue.title}" ➔ ${masterCategory}`);
    
    try {
      await client
        .patch(venue._id)
        .set({ masterCategory })
        .commit();
    } catch (err) {
      console.error(`❌ Error actualizando ${venue.title}:`, err);
    }
  }

  console.log(`✅ Migración completada.`);
}

migrate().catch(console.error);
