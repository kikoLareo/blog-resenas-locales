import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Iniciando configuración global de Playwright...');

  // Launch a browser to warm up and verify server is running
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the development server to be ready
    console.log('⏳ Verificando que el servidor esté ejecutándose...');
    
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    
    // Try to reach the homepage with retries
    let retries = 0;
    const maxRetries = 30;
    
    while (retries < maxRetries) {
      try {
        const response = await page.goto(baseURL, { 
          waitUntil: 'networkidle',
          timeout: 5000 
        });
        
        if (response && response.status() === 200) {
          console.log('✅ Servidor listo y respondiendo correctamente');
          break;
        }
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          throw new Error(`Servidor no disponible después de ${maxRetries} intentos`);
        }
        console.log(`⏳ Intento ${retries}/${maxRetries} - Esperando servidor...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Verify critical resources are loading
    console.log('🔍 Verificando recursos críticos...');
    
    // Check that basic page structure exists
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check for potential JavaScript errors
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });
    
    // Wait a bit for any initial JS to execute
    await page.waitForTimeout(2000);
    
    if (jsErrors.length > 0) {
      console.warn('⚠️ Errores JavaScript detectados:', jsErrors);
    } else {
      console.log('✅ No se detectaron errores JavaScript críticos');
    }

    // Warm up the application by visiting key routes
    console.log('🔥 Precalentando rutas principales...');
    
    const routes = ['/', '/blog', '/categorias'];
    
    for (const route of routes) {
      try {
        await page.goto(`${baseURL}${route}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });
        console.log(`✅ Ruta ${route} precalentada`);
      } catch (error) {
        console.warn(`⚠️ Error precalentando ruta ${route}:`, error);
      }
    }

    // Set up performance monitoring
    console.log('📊 Configurando monitoreo de performance...');
    
    // Enable performance timeline
    await page.evaluate(() => {
      // Mark the start of our test session
      performance.mark('test-session-start');
      
      // Set up performance observer for critical metrics
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              console.log(`LCP: ${entry.startTime}ms`);
            }
            if (entry.entryType === 'first-contentful-paint') {
              console.log(`FCP: ${entry.startTime}ms`);
            }
          }
        });
        
        try {
          observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        } catch (e) {
          // Ignore if not supported
        }
      }
    });

    console.log('✅ Configuración global completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la configuración global:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;