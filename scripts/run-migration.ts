/**
 * Script para ejecutar la migración de HomepageSection en producción
 * Ejecutar: npx tsx scripts/run-migration.ts
 */

async function runMigration() {
  const url = 'https://blog-resenas-locales.vercel.app/api/admin/migrate';
  
  console.log('🔄 Verificando si la tabla existe...');
  
  // 1. Verificar si existe
  const checkResponse = await fetch(url);
  const checkData = await checkResponse.json();
  
  console.log('📊 Estado actual:', checkData);
  
  if (checkData.tableExists) {
    console.log('✅ La tabla ya existe');
    return;
  }
  
  console.log('🔨 Creando tabla HomepageSection...');
  
  // 2. Crear tabla
  const createResponse = await fetch(url, {
    method: 'POST',
  });
  
  const createData = await createResponse.json();
  
  if (createData.success) {
    console.log('✅ Tabla creada exitosamente');
    console.log(createData);
  } else {
    console.error('❌ Error al crear tabla:', createData);
  }
  
  // 3. Verificar nuevamente
  const verifyResponse = await fetch(url);
  const verifyData = await verifyResponse.json();
  
  console.log('🔍 Verificación final:', verifyData);
}

runMigration().catch(console.error);
