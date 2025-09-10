#!/usr/bin/env node

/**
 * Performance Monitoring Utility Script
 * 
 * This script provides utilities for:
 * - Running performance analysis
 * - Generating performance reports
 * - Monitoring Core Web Vitals
 * - Bundle analysis automation
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const PERFORMANCE_CONFIG = {
  thresholds: {
    lcp: { good: 2500, needsImprovement: 4000 },
    fid: { good: 100, needsImprovement: 300 },
    cls: { good: 0.1, needsImprovement: 0.25 },
    fcp: { good: 1800, needsImprovement: 3000 },
    ttfb: { good: 800, needsImprovement: 1800 }
  },
  bundleThresholds: {
    maxTotalSize: 2 * 1024 * 1024, // 2MB
    maxJSFile: 500 * 1024,        // 500KB
    maxCSSFile: 200 * 1024        // 200KB
  }
};

class PerformanceMonitor {
  constructor() {
    this.results = {};
  }

  async runFullAnalysis() {
    console.log('🚀 Iniciando análisis completo de rendimiento...\n');
    
    try {
      // 1. Build analysis
      await this.runBuildAnalysis();
      
      // 2. Bundle analysis
      await this.runBundleAnalysis();
      
      // 3. Runtime performance (if server is running)
      await this.checkRuntimePerformance();
      
      // 4. Generate report
      await this.generateReport();
      
      console.log('\n✅ Análisis completo finalizado');
    } catch (error) {
      console.error('❌ Error durante el análisis:', error.message);
      process.exit(1);
    }
  }

  async runBuildAnalysis() {
    console.log('📦 Analizando build...');
    
    try {
      // Check if build exists
      await fs.access('.next');
      console.log('   ✓ Build encontrado');
      
      // Analyze build size
      const stats = await this.getBuildStats('.next');
      this.results.buildAnalysis = stats;
      
      console.log(`   📊 Tamaño total: ${this.formatSize(stats.totalSize)}`);
      console.log(`   📄 Archivos: ${stats.fileCount}`);
      
    } catch (error) {
      console.log('   ⚠️  No se encontró build. Ejecutando npm run build...');
      await this.execPromise('npm run build');
      await this.runBuildAnalysis();
    }
  }

  async runBundleAnalysis() {
    console.log('\n📋 Análisis detallado de bundles...');
    
    try {
      const response = await fetch('http://localhost:3000/api/performance/bundle-analysis');
      if (response.ok) {
        const bundleData = await response.json();
        this.results.bundleAnalysis = bundleData;
        
        console.log(`   📦 Tamaño total: ${this.formatSize(bundleData.totalSize)}`);
        console.log(`   🗜️  Comprimido: ${this.formatSize(bundleData.totalGzipSize)}`);
        console.log(`   📊 Compresión: ${((1 - bundleData.totalGzipSize / bundleData.totalSize) * 100).toFixed(1)}%`);
        
        // Show warnings for large files
        const largeFiles = bundleData.files.filter(f => 
          (f.type === 'js' && f.size > PERFORMANCE_CONFIG.bundleThresholds.maxJSFile) ||
          (f.type === 'css' && f.size > PERFORMANCE_CONFIG.bundleThresholds.maxCSSFile)
        );
        
        if (largeFiles.length > 0) {
          console.log('   ⚠️  Archivos grandes detectados:');
          largeFiles.forEach(file => {
            console.log(`      - ${file.file}: ${this.formatSize(file.size)}`);
          });
        }
      } else {
        console.log('   ⚠️  API no disponible (servidor no ejecutándose)');
      }
    } catch (error) {
      console.log('   ⚠️  No se pudo conectar al servidor para análisis de bundles');
    }
  }

  async checkRuntimePerformance() {
    console.log('\n⏱️  Verificando rendimiento en tiempo real...');
    
    try {
      const response = await fetch('http://localhost:3000/api/performance/metrics');
      if (response.ok) {
        const performanceData = await response.json();
        this.results.runtimePerformance = performanceData;
        
        if (performanceData.aggregatedStats) {
          const vitals = performanceData.aggregatedStats.coreWebVitals;
          console.log('   📊 Core Web Vitals (P75):');
          
          Object.entries(vitals).forEach(([vital, stats]) => {
            const value = stats.p75;
            const status = this.getVitalStatus(vital, value);
            const statusIcon = status === 'good' ? '✅' : status === 'needs-improvement' ? '⚠️' : '❌';
            const formattedValue = vital === 'cls' ? value.toFixed(3) : this.formatTime(value);
            
            console.log(`      ${statusIcon} ${vital.toUpperCase()}: ${formattedValue}`);
          });
          
          console.log(`   👥 Sesiones analizadas: ${performanceData.totalSessions}`);
          console.log(`   📈 Métricas recopiladas: ${performanceData.totalMetrics}`);
        } else {
          console.log('   ℹ️  No hay datos de rendimiento disponibles aún');
        }
      }
    } catch (error) {
      console.log('   ⚠️  Servidor no disponible para métricas en tiempo real');
    }
  }

  async generateReport() {
    console.log('\n📄 Generando reporte...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(),
      results: this.results,
      recommendations: this.generateRecommendations()
    };
    
    const reportPath = path.join(process.cwd(), 'performance-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`   💾 Reporte guardado: ${reportPath}`);
    
    // Print summary
    console.log('\n📊 RESUMEN DEL ANÁLISIS:');
    console.log('========================');
    
    if (report.summary.overallScore) {
      console.log(`🎯 Puntuación general: ${report.summary.overallScore}/100`);
    }
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMENDACIONES:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
  }

  generateSummary() {
    const summary = {};
    
    // Bundle summary
    if (this.results.bundleAnalysis) {
      const bundle = this.results.bundleAnalysis;
      summary.bundleSize = {
        total: bundle.totalSize,
        compressed: bundle.totalGzipSize,
        compressionRatio: ((1 - bundle.totalGzipSize / bundle.totalSize) * 100).toFixed(1)
      };
    }
    
    // Performance summary
    if (this.results.runtimePerformance?.aggregatedStats) {
      const vitals = this.results.runtimePerformance.aggregatedStats.coreWebVitals;
      const scores = Object.entries(vitals).map(([vital, stats]) => {
        const status = this.getVitalStatus(vital, stats.p75);
        return status === 'good' ? 100 : status === 'needs-improvement' ? 75 : 25;
      });
      
      summary.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      summary.coreWebVitals = vitals;
    }
    
    return summary;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Bundle recommendations
    if (this.results.bundleAnalysis) {
      recommendations.push(...this.results.bundleAnalysis.recommendations);
    }
    
    // Performance recommendations
    if (this.results.runtimePerformance?.aggregatedStats) {
      const vitals = this.results.runtimePerformance.aggregatedStats.coreWebVitals;
      
      if (vitals.lcp.p75 > PERFORMANCE_CONFIG.thresholds.lcp.needsImprovement) {
        recommendations.push('LCP es lento: optimizar imágenes hero y contenido above-the-fold');
      }
      
      if (vitals.cls.p75 > PERFORMANCE_CONFIG.thresholds.cls.needsImprovement) {
        recommendations.push('CLS alto: reservar espacio para imágenes y evitar cambios de layout');
      }
      
      if (vitals.fcp.p75 > PERFORMANCE_CONFIG.thresholds.fcp.needsImprovement) {
        recommendations.push('FCP lento: optimizar CSS crítico y fuentes');
      }
      
      if (vitals.ttfb.p75 > PERFORMANCE_CONFIG.thresholds.ttfb.needsImprovement) {
        recommendations.push('TTFB alto: optimizar servidor y caché');
      }
    }
    
    return recommendations;
  }

  async getBuildStats(buildPath) {
    const stats = { totalSize: 0, fileCount: 0 };
    
    try {
      const files = await fs.readdir(buildPath, { recursive: true });
      
      for (const file of files) {
        const filePath = path.join(buildPath, file);
        try {
          const stat = await fs.stat(filePath);
          if (stat.isFile()) {
            stats.totalSize += stat.size;
            stats.fileCount++;
          }
        } catch {
          // Skip files that can't be read
        }
      }
    } catch (error) {
      console.warn('Could not analyze build stats:', error.message);
    }
    
    return stats;
  }

  getVitalStatus(vital, value) {
    const thresholds = PERFORMANCE_CONFIG.thresholds[vital];
    if (!thresholds) return 'good';
    
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatTime(ms) {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  execPromise(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve(stdout);
      });
    });
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'full';
  
  const monitor = new PerformanceMonitor();
  
  switch (command) {
    case 'full':
    case 'analyze':
      await monitor.runFullAnalysis();
      break;
      
    case 'bundle':
      await monitor.runBundleAnalysis();
      break;
      
    case 'runtime':
      await monitor.checkRuntimePerformance();
      break;
      
    case 'build':
      await monitor.runBuildAnalysis();
      break;
      
    default:
      console.log(`
Uso: node scripts/performance-monitor.js [comando]

Comandos disponibles:
  full     - Análisis completo (por defecto)
  bundle   - Solo análisis de bundles
  runtime  - Solo métricas en tiempo real
  build    - Solo análisis de build

Ejemplos:
  node scripts/performance-monitor.js
  node scripts/performance-monitor.js bundle
  npm run performance:monitor
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { PerformanceMonitor };