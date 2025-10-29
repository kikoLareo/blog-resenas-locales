#!/usr/bin/env tsx

// Debug script para verificar referencias de ciudad en Sanity
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xaenlpyp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
})

async function debugCityField() {
  try {
    console.log('🔍 DEBUG: Campo ciudad en venues...\n')
    
    // 1. Verificar tipos de documento
    console.log('1. Verificando tipos de documento:')
    const docTypes = await client.fetch(`*[_type == "city" || _type == "venue"] | order(_type) {
      _type,
      _id,
      title
    }`)
    
    const cities = docTypes.filter((doc: any) => doc._type === 'city')
    const venues = docTypes.filter((doc: any) => doc._type === 'venue')
    
    console.log(`   - Ciudades encontradas: ${cities.length}`)
    cities.forEach((city: any, i: number) => {
      console.log(`     ${i+1}. ${city.title} (ID: ${city._id})`)
    })
    
    console.log(`   - Venues encontrados: ${venues.length}`)
    venues.slice(0, 3).forEach((venue: any, i: number) => {
      console.log(`     ${i+1}. ${venue.title} (ID: ${venue._id})`)
    })
    
    // 2. Verificar un venue específico con detalles completos
    console.log('\n2. Analizando venue específico:')
    const venueDetail = await client.fetch(`*[_type == "venue"][0] {
      _id,
      _type,
      title,
      slug,
      city,
      "cityDetails": city-> {
        _id,
        _type,
        title,
        slug
      }
    }`)
    
    if (venueDetail) {
      console.log(`   - Venue: ${venueDetail.title}`)
      console.log(`   - Tipo: ${venueDetail._type}`)
      console.log(`   - City field: ${JSON.stringify(venueDetail.city, null, 2)}`)
      console.log(`   - City details: ${JSON.stringify(venueDetail.cityDetails, null, 2)}`)
    }
    
    // 3. Verificar la estructura del schema (usando GROQ para obtener info)
    console.log('\n3. Verificando accesibilidad de las ciudades:')
    const cityCheck = await client.fetch(`*[_type == "city"] {
      _id,
      title,
      slug,
      "canReference": true
    }`)
    
    console.log(`   - Ciudades accesibles para referencia: ${cityCheck.length}`)
    cityCheck.forEach((city: any, i: number) => {
      console.log(`     ${i+1}. ${city.title} - Slug: ${city.slug?.current} (ID: ${city._id})`)
    })

    return { cities, venues, venueDetail, cityCheck }

  } catch (error) {
    console.error('❌ Error en debug:', error)
    throw error
  }
}

async function main() {
  try {
    console.log('🚀 DEBUGGING CAMPO CIUDAD EN VENUE MODAL\n')
    
    const result = await debugCityField()
    
    console.log('\n' + '='.repeat(60))
    console.log('🎯 DIAGNÓSTICO:')
    
    if (result.cities.length === 0) {
      console.log('❌ PROBLEMA: No hay ciudades en Sanity')
      console.log('   → Esto explica por qué no aparece el campo ciudad')
      console.log('   → Solución: Crear ciudades en Studio')
    } else {
      console.log('✅ Ciudades existen en Sanity')
      
      if (result.venueDetail.city) {
        console.log('✅ Venue tiene ciudad asignada')
        console.log('❓ POSIBLE PROBLEMA: Cache de Studio o permisos')
      } else {
        console.log('❌ PROBLEMA: Venue no tiene ciudad asignada')
        console.log('   → Campo aparece vacío en Studio')
      }
    }
    
    console.log('\n📝 SIGUIENTE PASO:')
    console.log('1. Ve a http://localhost:3333/')
    console.log('2. Navega a "Locales" → "Todos los Locales"')
    console.log('3. Abre cualquier venue para editar')
    console.log('4. Busca el campo "Ciudad" en el formulario')
    console.log('5. Si no aparece, reinicia el Studio (Ctrl+C y npm run studio)')

  } catch (error) {
    console.error('❌ Error en debugging:', error)
    process.exit(1)
  }
}

main()