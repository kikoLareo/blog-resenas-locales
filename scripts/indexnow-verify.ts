#!/usr/bin/env tsx

/**
 * Script para generar el archivo de verificación de IndexNow
 * 
 * Este script crea el archivo <INDEXNOW_KEY>.txt en el directorio public/
 * que es necesario para verificar la propiedad del dominio con IndexNow.
 * 
 * Uso:
 *   npx tsx scripts/indexnow-verify.ts
 *   npm run indexnow:verify (si se añade al package.json)
 */

import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const PUBLIC_DIR = join(process.cwd(), 'public');

function generateVerificationFile() {
  if (!INDEXNOW_KEY) {
    console.log('⚠️  INDEXNOW_KEY no está definida en las variables de entorno');
    console.log('   Para generar el archivo de verificación, define INDEXNOW_KEY en tu archivo .env');
    return;
  }

  if (INDEXNOW_KEY.length !== 32) {
    console.error('❌ INDEXNOW_KEY debe tener exactamente 32 caracteres');
    return;
  }

  const verificationFilePath = join(PUBLIC_DIR, `${INDEXNOW_KEY}.txt`);
  
  try {
    // Crear el archivo con el contenido de la clave
    writeFileSync(verificationFilePath, INDEXNOW_KEY, 'utf8');
    console.log('✅ Archivo de verificación de IndexNow creado exitosamente');
    console.log(`   Archivo: public/${INDEXNOW_KEY}.txt`);
    console.log(`   Contenido: ${INDEXNOW_KEY}`);
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('   1. Despliega tu aplicación');
    console.log(`   2. Verifica que https://tu-dominio.com/${INDEXNOW_KEY}.txt es accesible`);
    console.log('   3. El archivo debe devolver exactamente: ' + INDEXNOW_KEY);
    
  } catch (error) {
    console.error('❌ Error creando el archivo de verificación:', error);
  }
}

function cleanupOldVerificationFiles() {
  try {
    const fs = require('fs');
    const files = fs.readdirSync(PUBLIC_DIR);
    
    // Buscar archivos que parezcan claves de IndexNow (32 caracteres, solo letras y números)
    const indexnowFiles = files.filter((file: string) => {
      return file.match(/^[a-f0-9]{32}\.txt$/i) && file !== `${INDEXNOW_KEY}.txt`;
    });
    
    if (indexnowFiles.length > 0) {
      console.log('🧹 Limpiando archivos de verificación antiguos...');
      indexnowFiles.forEach((file: string) => {
        const filePath = join(PUBLIC_DIR, file);
        unlinkSync(filePath);
        console.log(`   Eliminado: ${file}`);
      });
    }
  } catch (error) {
    console.warn('⚠️  No se pudieron limpiar archivos antiguos:', error);
  }
}

function main() {
  console.log('🔑 Generador de archivo de verificación de IndexNow\n');
  
  if (!existsSync(PUBLIC_DIR)) {
    console.error('❌ El directorio public/ no existe');
    return;
  }
  
  cleanupOldVerificationFiles();
  generateVerificationFile();
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

export { generateVerificationFile, cleanupOldVerificationFiles };