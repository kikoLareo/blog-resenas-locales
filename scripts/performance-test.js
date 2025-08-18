#!/usr/bin/env node

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runPerformanceTest() {
  console.log('🚀 Iniciando análisis de rendimiento...');
  
  const url = 'http://localhost:3001';
  
  try {
    // Lanzar Chrome
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
    });
    
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
    };
    
    console.log('📊 Ejecutando Lighthouse...');
    const runnerResult = await lighthouse(url, options);
    const report = runnerResult.lhr;
    
    // Extraer métricas clave
    const metrics = {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100),
      seo: Math.round(report.categories.seo.score * 100),
      firstContentfulPaint: Math.round(report.audits['first-contentful-paint'].numericValue),
      largestContentfulPaint: Math.round(report.audits['largest-contentful-paint'].numericValue),
      cumulativeLayoutShift: report.audits['cumulative-layout-shift'].numericValue,
      totalBlockingTime: Math.round(report.audits['total-blocking-time'].numericValue),
      speedIndex: Math.round(report.audits['speed-index'].numericValue),
    };
    
    console.log('\n📈 RESULTADOS DEL ANÁLISIS DE RENDIMIENTO');
    console.log('==========================================');
    console.log(`🎯 Performance Score: ${metrics.performance}/100`);
    console.log(`♿ Accessibility Score: ${metrics.accessibility}/100`);
    console.log(`✅ Best Practices Score: ${metrics.bestPractices}/100`);
    console.log(`🔍 SEO Score: ${metrics.seo}/100`);
    console.log('\n⏱️ Core Web Vitals:');
    console.log(`   FCP: ${metrics.firstContentfulPaint}ms`);
    console.log(`   LCP: ${metrics.largestContentfulPaint}ms`);
    console.log(`   CLS: ${metrics.cumulativeLayoutShift.toFixed(3)}`);
    console.log(`   TBT: ${metrics.totalBlockingTime}ms`);
    console.log(`   Speed Index: ${metrics.speedIndex}ms`);
    
    // Evaluar resultados
    console.log('\n📋 EVALUACIÓN:');
    if (metrics.performance >= 90) {
      console.log('✅ Performance: EXCELENTE');
    } else if (metrics.performance >= 70) {
      console.log('⚠️ Performance: BUENO (necesita mejoras)');
    } else {
      console.log('❌ Performance: NECESITA OPTIMIZACIÓN');
    }
    
    if (metrics.largestContentfulPaint < 2500) {
      console.log('✅ LCP: ÓPTIMO (< 2.5s)');
    } else if (metrics.largestContentfulPaint < 4000) {
      console.log('⚠️ LCP: ACEPTABLE (2.5-4s)');
    } else {
      console.log('❌ LCP: LENTO (> 4s)');
    }
    
    if (metrics.cumulativeLayoutShift < 0.1) {
      console.log('✅ CLS: ÓPTIMO (< 0.1)');
    } else if (metrics.cumulativeLayoutShift < 0.25) {
      console.log('⚠️ CLS: ACEPTABLE (0.1-0.25)');
    } else {
      console.log('❌ CLS: MALO (> 0.25)');
    }
    
    await chrome.kill();
    
  } catch (error) {
    console.error('❌ Error durante el análisis:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runPerformanceTest();
}

module.exports = { runPerformanceTest };
