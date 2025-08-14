import { FullConfig } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Iniciando limpieza global de Playwright...');

  try {
    // Clean up any temporary files
    console.log('🗂️ Limpiando archivos temporales...');
    
    const tempDirs = [
      'test-results/temp',
      '.playwright-cache',
    ];

    for (const dir of tempDirs) {
      try {
        await fs.rmdir(dir, { recursive: true });
        console.log(`✅ Directorio ${dir} limpiado`);
      } catch (error) {
        // Directory might not exist, which is fine
      }
    }

    // Generate test summary if results exist
    console.log('📊 Generando resumen de tests...');
    
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
    
    try {
      const resultsContent = await fs.readFile(resultsPath, 'utf-8');
      const results = JSON.parse(resultsContent);
      
      const summary = {
        totalTests: results.suites?.reduce((acc: number, suite: any) => 
          acc + (suite.specs?.length || 0), 0) || 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: results.stats?.duration || 0,
      };

      // Count test results
      const countResults = (suites: any[]) => {
        for (const suite of suites || []) {
          for (const spec of suite.specs || []) {
            for (const test of spec.tests || []) {
              for (const result of test.results || []) {
                switch (result.status) {
                  case 'passed':
                    summary.passed++;
                    break;
                  case 'failed':
                    summary.failed++;
                    break;
                  case 'skipped':
                    summary.skipped++;
                    break;
                }
              }
            }
          }
          // Handle nested suites
          if (suite.suites) {
            countResults(suite.suites);
          }
        }
      };

      countResults(results.suites || []);

      console.log('📋 Resumen de tests E2E:');
      console.log(`   ✅ Pasaron: ${summary.passed}`);
      console.log(`   ❌ Fallaron: ${summary.failed}`);
      console.log(`   ⏭️ Omitidos: ${summary.skipped}`);
      console.log(`   ⏱️ Duración: ${Math.round(summary.duration / 1000)}s`);

      // Write summary to file
      const summaryPath = path.join(process.cwd(), 'test-results', 'summary.json');
      await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
      console.log(`✅ Resumen guardado en ${summaryPath}`);

      // Generate performance report if we have performance data
      await generatePerformanceReport();

    } catch (error) {
      console.log('ℹ️ No se encontraron resultados de tests para procesar');
    }

    // Clean up browser processes (safety measure)
    console.log('🔄 Verificando procesos de navegador...');
    
    if (process.platform !== 'win32') {
      try {
        const { exec } = require('child_process');
        exec('pkill -f "chromium|firefox|webkit"', (error) => {
          // Ignore errors - processes might not exist
        });
      } catch (error) {
        // Ignore cleanup errors
      }
    }

    console.log('✅ Limpieza global completada exitosamente');

  } catch (error) {
    console.error('❌ Error en la limpieza global:', error);
    // Don't throw - teardown errors shouldn't fail the test run
  }
}

async function generatePerformanceReport() {
  try {
    console.log('📈 Generando reporte de performance...');
    
    // This would collect performance data from various test runs
    // For now, we'll create a placeholder structure
    const performanceReport = {
      timestamp: new Date().toISOString(),
      metrics: {
        averageLCP: 0,
        averageFCP: 0,
        averageCLS: 0,
        averageTTFB: 0,
      },
      recommendations: [
        'Verificar que todas las imágenes tengan dimensiones explícitas',
        'Asegurar que los anuncios reserven espacio adecuado',
        'Optimizar la carga de recursos críticos',
        'Validar que JSON-LD esté presente en todas las páginas',
      ],
    };

    const reportPath = path.join(process.cwd(), 'test-results', 'performance-report.json');
    await fs.writeFile(reportPath, JSON.stringify(performanceReport, null, 2));
    
    console.log('✅ Reporte de performance generado');
  } catch (error) {
    console.warn('⚠️ Error generando reporte de performance:', error);
  }
}

export default globalTeardown;