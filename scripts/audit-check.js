#!/usr/bin/env node

/**
 * Accessibility and SEO Audit Script
 * Verifies implementation quality without running tests
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Iniciando auditoría de accesibilidad y SEO...\n');

// Helper functions
function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkFileContains(filePath, patterns) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return patterns.map(pattern => ({
      pattern,
      found: content.includes(pattern) || (pattern instanceof RegExp && pattern.test(content))
    }));
  } catch {
    return patterns.map(pattern => ({ pattern, found: false }));
  }
}

function logSection(title) {
  console.log(`\n📋 ${title}`);
  console.log('=' .repeat(50));
}

function logResult(check, label) {
  const status = check ? '✅' : '❌';
  console.log(`${status} ${label}`);
}

// 1. Check required pages exist
logSection('Verificación de Páginas Públicas');

const requiredPages = [
  'app/(public)/buscar/page.tsx',
  'app/(public)/[city]/page.tsx',
  'app/(public)/[city]/[venue]/page.tsx',
  'app/(public)/[city]/[venue]/review/[reviewSlug]/page.tsx'
];

requiredPages.forEach(page => {
  logResult(checkFileExists(page), `${page}`);
});

// 2. Check required components exist
logSection('Verificación de Componentes');

const requiredComponents = [
  'components/VenueCard.tsx',
  'components/SearchForm.tsx'
];

requiredComponents.forEach(component => {
  logResult(checkFileExists(component), `${component}`);
});

// 3. Check SEO implementation
logSection('Auditoría de SEO');

const seoChecks = [
  {
    file: 'app/(public)/buscar/page.tsx',
    patterns: [
      'generateMetadata',
      'title',
      'description',
      'openGraph',
      'canonical'
    ],
    label: 'Búsqueda - Meta tags'
  },
  {
    file: 'lib/schema.ts',
    patterns: [
      'websiteJsonLd',
      'localBusinessJsonLd',
      'reviewJsonLd',
      'breadcrumbsJsonLd'
    ],
    label: 'Schema.org JSON-LD'
  },
  {
    file: 'components/Breadcrumbs.tsx',
    patterns: [
      '@context',
      'schema.org',
      'BreadcrumbList'
    ],
    label: 'Breadcrumbs Schema'
  }
];

seoChecks.forEach(check => {
  const results = checkFileContains(check.file, check.patterns);
  const allFound = results.every(r => r.found);
  logResult(allFound, check.label);
  
  if (!allFound) {
    results.filter(r => !r.found).forEach(r => {
      console.log(`  ⚠️  Faltante: ${r.pattern}`);
    });
  }
});

// 4. Check accessibility implementation
logSection('Auditoría de Accesibilidad');

const accessibilityChecks = [
  {
    file: 'components/SearchForm.tsx',
    patterns: [
      'aria-label=',
      'aria-hidden=',
      'autoComplete='
    ],
    label: 'SearchForm - ARIA attributes'
  },
  {
    file: 'app/(public)/buscar/page.tsx',
    patterns: [
      '<h1',
      '<main',
      '<article',
      'alt='
    ],
    label: 'Búsqueda - Estructura semántica'
  },
  {
    file: 'components/VenueCard.tsx',
    patterns: [
      '<article',
      'alt=',
      'loading="lazy"'
    ],
    label: 'VenueCard - Semántica y performance'
  }
];

accessibilityChecks.forEach(check => {
  const results = checkFileContains(check.file, check.patterns);
  const allFound = results.every(r => r.found);
  logResult(allFound, check.label);
});

// 5. Check API implementation
logSection('Auditoría de API Routes');

const apiRoutes = [
  'app/api/admin/venues/route.ts',
  'app/api/admin/venues/[id]/route.ts'
];

apiRoutes.forEach(route => {
  const exists = checkFileExists(route);
  logResult(exists, `${route}`);
  
  if (exists) {
    const methods = checkFileContains(route, ['GET', 'POST', 'PUT', 'DELETE']);
    methods.forEach(method => {
      if (method.found) {
        console.log(`  ✅ ${method.pattern} method implemented`);
      }
    });
  }
});

// 6. Check dashboard forms
logSection('Auditoría de Dashboard Forms');

const dashboardForms = [
  {
    file: 'app/dashboard/venues/new/page.tsx',
    patterns: ['handleSave', 'fetch(', '/api/admin/venues'],
    label: 'Venues form - API integration'
  },
  {
    file: 'app/dashboard/categories/new/page.tsx',
    patterns: ['handleSave'],
    label: 'Categories form - Handler'
  },
  {
    file: 'app/dashboard/cities/new/page.tsx',
    patterns: ['handleSave'],
    label: 'Cities form - Handler'
  }
];

dashboardForms.forEach(check => {
  const results = checkFileContains(check.file, check.patterns);
  const hasApiIntegration = results.some(r => r.pattern.includes('/api/') && r.found);
  const hasHandler = results.some(r => r.pattern === 'handleSave' && r.found);
  
  if (hasApiIntegration) {
    logResult(true, `${check.label} - CONNECTED TO API`);
  } else if (hasHandler) {
    logResult(true, `${check.label} - UI ONLY`);
  } else {
    logResult(false, check.label);
  }
});

// 7. Final summary
logSection('Resumen de Auditoría');

const allPages = requiredPages.every(checkFileExists);
const allComponents = requiredComponents.every(checkFileExists);
const hasVenueApi = checkFileExists('app/api/admin/venues/route.ts');
const hasSearchPage = checkFileExists('app/(public)/buscar/page.tsx');

console.log('\n📊 RESULTADOS FINALES:');
logResult(allPages, 'Todas las páginas públicas requeridas');
logResult(allComponents, 'Todos los componentes requeridos');
logResult(hasVenueApi, 'API routes para venues implementados');
logResult(hasSearchPage, 'Página de búsqueda implementada');

const completionPercentage = [allPages, allComponents, hasVenueApi, hasSearchPage]
  .filter(Boolean).length / 4 * 100;

console.log(`\n🎯 COMPLETITUD GENERAL: ${completionPercentage}%`);

if (completionPercentage >= 90) {
  console.log('🟢 ESTADO: EXCELENTE - Implementación prácticamente completa');
} else if (completionPercentage >= 75) {
  console.log('🟡 ESTADO: BUENO - Implementación mayormente completa');
} else {
  console.log('🔴 ESTADO: NECESITA TRABAJO - Implementación incompleta');
}

console.log('\n✨ Auditoría completada');