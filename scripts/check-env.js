#!/usr/bin/env node

const requiredEnvVars = {
  // Variables críticas
  NEXTAUTH_SECRET: {
    required: true,
    description: 'Secret para NextAuth.js',
    example: '7cce0f4acf16c22f449dfa846c1f8c9bc478e24bb8c9ed9fff4589d142791fb4'
  },
  NEXTAUTH_URL: {
    required: true,
    description: 'URL de la aplicación',
    example: 'https://tu-dominio.vercel.app'
  },
  
  // Sanity CMS
  NEXT_PUBLIC_SANITY_PROJECT_ID: {
    required: true,
    description: 'ID del proyecto de Sanity',
    example: 'xaenlpyp'
  },
  NEXT_PUBLIC_SANITY_DATASET: {
    required: true,
    description: 'Dataset de Sanity',
    example: 'production'
  },
  SANITY_API_READ_TOKEN: {
    required: true,
    description: 'Token de lectura de Sanity',
    example: 'sk...'
  },
  
  // Variables opcionales
  DATABASE_URL: {
    required: false,
    description: 'URL de conexión a la base de datos',
    example: 'postgresql://user:pass@host:port/db'
  },
  ADMIN_EMAIL: {
    required: false,
    description: 'Email del administrador',
    example: 'admin@example.com'
  },
  ADMIN_PASSWORD_HASH: {
    required: false,
    description: 'Hash de la contraseña del administrador',
    example: '$2b$10$...'
  }
};

console.log('🔍 Verificando variables de entorno...\n');

let allRequiredVarsPresent = true;
let missingVars = [];
let presentVars = [];

for (const [varName, config] of Object.entries(requiredEnvVars)) {
  const value = process.env[varName];
  
  if (config.required && !value) {
    missingVars.push({ name: varName, ...config });
    allRequiredVarsPresent = false;
  } else if (value) {
    presentVars.push({ name: varName, value: value.substring(0, 20) + '...', ...config });
  }
}

// Mostrar variables presentes
if (presentVars.length > 0) {
  console.log('✅ Variables configuradas:');
  presentVars.forEach(({ name, value, description }) => {
    console.log(`   ${name}: ${value} (${description})`);
  });
  console.log('');
}

// Mostrar variables faltantes
if (missingVars.length > 0) {
  console.log('❌ Variables faltantes:');
  missingVars.forEach(({ name, description, example }) => {
    console.log(`   ${name}: ${description}`);
    console.log(`      Ejemplo: ${example}`);
    console.log('');
  });
}

// Mostrar variables opcionales no configuradas
const optionalVars = Object.entries(requiredEnvVars)
  .filter(([_, config]) => !config.required)
  .filter(([varName, _]) => !process.env[varName]);

if (optionalVars.length > 0) {
  console.log('⚠️  Variables opcionales no configuradas:');
  optionalVars.forEach(([varName, config]) => {
    console.log(`   ${varName}: ${config.description}`);
  });
  console.log('');
}

// Resultado final
if (allRequiredVarsPresent) {
  console.log('🎉 ¡Todas las variables requeridas están configuradas!');
  process.exit(0);
} else {
  console.log('🚨 Faltan variables requeridas. Por favor, configúralas antes de continuar.');
  process.exit(1);
}
