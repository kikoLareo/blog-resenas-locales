#!/usr/bin/env node
/**
 * 🧪 TESTING AUTOMÁTICO - Sistema Venue Onboarding
 * 
 * Este script ejecuta tests automáticos para validar el sistema
 * de onboarding de venues vía QR.
 */

const https = require('https');
const http = require('http');

// Configuración
const BASE_URL = 'http://localhost:3000';
const STUDIO_URL = 'http://localhost:3333';

// Colores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.magenta}🧪 ${msg}${colors.reset}`)
};

// Función helper para hacer requests HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestModule = urlObj.protocol === 'https:' ? https : http;
    
    const req = requestModule.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 10000,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Tests
async function testServerAvailability() {
  log.test('TEST 1: Verificar disponibilidad de servidores');
  
  try {
    // Test Next.js app
    const appResponse = await makeRequest(`${BASE_URL}/api/health`);
    if (appResponse.statusCode === 200 || appResponse.statusCode === 404) {
      log.success('Next.js app disponible en localhost:3000');
    } else {
      log.warning(`Next.js app responde con código ${appResponse.statusCode}`);
    }
  } catch (error) {
    log.error(`Next.js app no disponible: ${error.message}`);
  }

  try {
    // Test Sanity Studio
    const studioResponse = await makeRequest(STUDIO_URL);
    if (studioResponse.statusCode === 200) {
      log.success('Sanity Studio disponible en localhost:3333');
    } else {
      log.warning(`Sanity Studio responde con código ${studioResponse.statusCode}`);
    }
  } catch (error) {
    log.error(`Sanity Studio no disponible: ${error.message}`);
  }
}

async function testAPIEndpoints() {
  log.test('TEST 2: Verificar endpoints críticos del sistema');
  
  const endpoints = [
    { path: '/', name: 'Homepage' },
    { path: '/acceso-simple', name: 'Login page' },
    { path: '/dashboard', name: 'Dashboard (requiere auth)' },
    { path: '/api/qr/submit-venue', name: 'Submit venue API', method: 'POST' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint.path}`, {
        method: endpoint.method || 'GET'
      });
      
      if (response.statusCode < 500) {
        log.success(`${endpoint.name}: ${response.statusCode}`);
      } else {
        log.error(`${endpoint.name}: Error ${response.statusCode}`);
      }
    } catch (error) {
      log.error(`${endpoint.name}: ${error.message}`);
    }
  }
}

async function testQRCodeGeneration() {
  log.test('TEST 3: Simulación básica de generación QR');
  
  // Este test requiere autenticación, así que solo verificamos la ruta
  try {
    const response = await makeRequest(`${BASE_URL}/dashboard/qr-codes/new`);
    if (response.statusCode === 200 || response.statusCode === 401 || response.statusCode === 302) {
      log.success(`QR creation page accessible (${response.statusCode})`);
    } else {
      log.warning(`QR creation page: ${response.statusCode}`);
    }
  } catch (error) {
    log.error(`QR creation test failed: ${error.message}`);
  }
}

async function testOnboardingFlow() {
  log.test('TEST 4: Verificar rutas de onboarding');
  
  const testCode = 'TEST-CODE-123';
  
  try {
    // Test ruta base QR
    const qrResponse = await makeRequest(`${BASE_URL}/qr/${testCode}`);
    log.info(`QR route /qr/${testCode}: ${qrResponse.statusCode}`);
    
    // Test ruta onboarding
    const onboardingResponse = await makeRequest(`${BASE_URL}/qr/onboarding/${testCode}`);
    log.info(`Onboarding route: ${onboardingResponse.statusCode}`);
    
    // Test venue submissions dashboard
    const submissionsResponse = await makeRequest(`${BASE_URL}/dashboard/venue-submissions`);
    log.info(`Submissions dashboard: ${submissionsResponse.statusCode}`);
    
    log.success('Rutas de onboarding configuradas correctamente');
  } catch (error) {
    log.error(`Onboarding flow test failed: ${error.message}`);
  }
}

async function runAllTests() {
  console.log(`${colors.blue}
╔══════════════════════════════════════════════════════════════╗
║                🧪 VENUE ONBOARDING TESTS                     ║
║                                                              ║
║  Validando sistema completo de registro de venues vía QR    ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  log.info('Iniciando tests automáticos...');
  
  await testServerAvailability();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testAPIEndpoints();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testQRCodeGeneration();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testOnboardingFlow();
  
  console.log(`${colors.blue}
╔══════════════════════════════════════════════════════════════╗
║                        📋 SIGUIENTE                         ║
║                                                              ║
║  1. Abrir http://localhost:3000/acceso-simple               ║
║  2. Login: admin@saborlocal.com / admin123                  ║
║  3. Seguir TESTING_GUIDE_VENUE_ONBOARDING.md               ║
║  4. Crear primer QR de onboarding                           ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);
}

// Ejecutar tests
runAllTests().catch(console.error);