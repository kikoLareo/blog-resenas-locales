/**
 * Answer Engine Optimization (AEO) Monitoring and Analytics
 * Tracks performance metrics and optimization compliance
 */

interface AEOMetrics {
  pageUrl: string;
  timestamp: string;
  
  // Schema.org compliance
  hasJsonLd: boolean;
  schemaTypes: string[];
  hasSpeakableMarkup: boolean;
  
  // Content optimization
  hasFAQ: boolean;
  faqCount: number;
  hasOptimizedTldr: boolean;
  tldrWordCount: number;
  
  // Voice search readiness
  hasNaturalQuestions: boolean;
  hasConversationalContent: boolean;
  hasAnswerFormat: boolean;
  
  // Featured snippet optimization
  hasListContent: boolean;
  hasTableContent: boolean;
  hasParagraphAnswers: boolean;
  
  // Performance indicators
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
}

interface AEOValidationResult {
  score: number; // 0-100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  issues: AEOIssue[];
  suggestions: AEOSuggestion[];
  metrics: AEOMetrics;
}

interface AEOIssue {
  severity: 'critical' | 'warning' | 'info';
  category: 'schema' | 'content' | 'voice' | 'performance';
  message: string;
  element?: string;
  fix?: string;
}

interface AEOSuggestion {
  category: 'schema' | 'content' | 'voice' | 'performance';
  message: string;
  impact: 'high' | 'medium' | 'low';
  implementation: 'easy' | 'medium' | 'hard';
}

/**
 * Validate page for AEO compliance
 */
export function validatePageAEO(pageContent?: {
  url?: string;
  title?: string;
  description?: string;
  content?: string;
  faqs?: any[];
  schemas?: any[];
}): AEOValidationResult {
  const issues: AEOIssue[] = [];
  const suggestions: AEOSuggestion[] = [];
  let score = 100;
  
  // Initialize metrics
  const metrics: AEOMetrics = {
    pageUrl: pageContent?.url || '',
    timestamp: new Date().toISOString(),
    hasJsonLd: false,
    schemaTypes: [],
    hasSpeakableMarkup: false,
    hasFAQ: false,
    faqCount: 0,
    hasOptimizedTldr: false,
    tldrWordCount: 0,
    hasNaturalQuestions: false,
    hasConversationalContent: false,
    hasAnswerFormat: false,
    hasListContent: false,
    hasTableContent: false,
    hasParagraphAnswers: false,
  };

  // Validate Schema.org markup
  if (pageContent?.schemas && pageContent.schemas.length > 0) {
    metrics.hasJsonLd = true;
    metrics.schemaTypes = pageContent.schemas.map(s => s['@type']).filter(Boolean);
    
    // Check for speakable markup
    const hasSpeakable = pageContent.schemas.some(schema => 
      JSON.stringify(schema).includes('speakable')
    );
    metrics.hasSpeakableMarkup = hasSpeakable;
    
    if (!hasSpeakable) {
      score -= 10;
      issues.push({
        severity: 'warning',
        category: 'voice',
        message: 'Falta marcado speakable para búsqueda por voz',
        fix: 'Agregar propiedades speakable a los esquemas JSON-LD',
      });
    }
  } else {
    score -= 20;
    issues.push({
      severity: 'critical',
      category: 'schema',
      message: 'No se encontró marcado estructurado JSON-LD',
      fix: 'Implementar schemas de Schema.org apropiados',
    });
  }

  // Validate FAQ content
  if (pageContent?.faqs && pageContent.faqs.length > 0) {
    metrics.hasFAQ = true;
    metrics.faqCount = pageContent.faqs.length;
    
    // Check FAQ quality
    pageContent.faqs.forEach((faq, index) => {
      if (!faq.question?.includes('?')) {
        score -= 5;
        issues.push({
          severity: 'warning',
          category: 'content',
          message: `FAQ ${index + 1}: La pregunta no incluye signo de interrogación`,
          element: `FAQ question ${index + 1}`,
          fix: 'Reformular como pregunta directa',
        });
      }
      
      const answerLength = faq.answer?.length || 0;
      if (answerLength > 300) {
        score -= 3;
        issues.push({
          severity: 'info',
          category: 'content',
          message: `FAQ ${index + 1}: Respuesta muy larga para featured snippets`,
          element: `FAQ answer ${index + 1}`,
          fix: 'Acortar respuesta a menos de 300 caracteres',
        });
      }
    });
    
    if (pageContent.faqs.length < 3) {
      suggestions.push({
        category: 'content',
        message: 'Considera agregar más FAQs para mejor cobertura',
        impact: 'medium',
        implementation: 'easy',
      });
    }
  } else {
    score -= 15;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: 'No se encontraron FAQs para búsqueda por voz',
      fix: 'Agregar sección de preguntas frecuentes',
    });
  }

  // Validate title and description
  if (pageContent?.title) {
    const hasQuestionWords = /\b(cómo|qué|cuál|dónde|cuándo|por qué|quién)\b/i.test(pageContent.title);
    if (hasQuestionWords) {
      metrics.hasNaturalQuestions = true;
    } else {
      suggestions.push({
        category: 'voice',
        message: 'El título podría incluir palabras de pregunta para búsqueda por voz',
        impact: 'medium',
        implementation: 'easy',
      });
    }
    
    if (pageContent.title.length > 60) {
      score -= 5;
      issues.push({
        severity: 'warning',
        category: 'content',
        message: 'Título demasiado largo para SEO',
        fix: 'Mantener títulos bajo 60 caracteres',
      });
    }
  }

  if (pageContent?.description) {
    if (pageContent.description.length > 160) {
      score -= 5;
      issues.push({
        severity: 'warning',
        category: 'content',
        message: 'Meta description demasiado larga',
        fix: 'Mantener descripciones bajo 160 caracteres',
      });
    }
  }

  // Validate content structure
  if (pageContent?.content) {
    // Check for list content (good for featured snippets)
    const hasLists = /(<ul>|<ol>|\d+\.|•)/i.test(pageContent.content);
    metrics.hasListContent = hasLists;
    
    // Check for conversational content
    const hasConversational = /(puedes|debes|te recomiendo|es importante|considera)/i.test(pageContent.content);
    metrics.hasConversationalContent = hasConversational;
    
    // Check for answer format (who, what, when, where, why, how)
    const hasAnswerFormat = /(qué es|dónde está|cuándo|cómo|por qué|quién)/i.test(pageContent.content);
    metrics.hasAnswerFormat = hasAnswerFormat;
    
    if (!hasAnswerFormat) {
      suggestions.push({
        category: 'voice',
        message: 'Agregar contenido en formato de respuesta (qué, cómo, dónde, etc.)',
        impact: 'high',
        implementation: 'medium',
      });
    }
  }

  // Calculate grade
  const grade = calculateAEOGrade(score);

  return {
    score: Math.max(0, Math.min(100, score)),
    grade,
    issues,
    suggestions,
    metrics,
  };
}

/**
 * Monitor AEO metrics in the browser
 */
export function startAEOMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Monitor page performance
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        console.log('AEO Monitor: Page load metrics', entry);
      }
    }
  });

  observer.observe({ entryTypes: ['navigation'] });

  // Monitor schema.org markup
  const schemas = document.querySelectorAll('script[type="application/ld+json"]');
  console.log(`AEO Monitor: Found ${schemas.length} JSON-LD schemas`);

  // Monitor speakable content
  const speakableElements = document.querySelectorAll('[data-speakable="true"]');
  console.log(`AEO Monitor: Found ${speakableElements.length} speakable elements`);

  // Monitor FAQ sections
  const faqSections = document.querySelectorAll('[itemtype*="FAQPage"]');
  console.log(`AEO Monitor: Found ${faqSections.length} FAQ sections`);
}

/**
 * Generate AEO performance report
 */
export function generateAEOReport(validationResult: AEOValidationResult): string {
  const { score, grade, issues, suggestions, metrics } = validationResult;
  
  let report = `# Reporte de Optimización AEO\n\n`;
  report += `**Puntuación:** ${score}/100 (${grade})\n`;
  report += `**Fecha:** ${new Date().toLocaleDateString('es-ES')}\n\n`;
  
  // Metrics summary
  report += `## Métricas de Optimización\n\n`;
  report += `- ✅ JSON-LD: ${metrics.hasJsonLd ? 'Sí' : 'No'}\n`;
  report += `- 🎙️ Marcado speakable: ${metrics.hasSpeakableMarkup ? 'Sí' : 'No'}\n`;
  report += `- ❓ FAQs: ${metrics.faqCount} preguntas\n`;
  report += `- 📝 Contenido conversacional: ${metrics.hasConversationalContent ? 'Sí' : 'No'}\n`;
  report += `- 📋 Contenido en listas: ${metrics.hasListContent ? 'Sí' : 'No'}\n\n`;
  
  // Issues
  if (issues.length > 0) {
    report += `## Problemas Encontrados\n\n`;
    issues.forEach((issue, index) => {
      const icon = issue.severity === 'critical' ? '🔴' : 
                  issue.severity === 'warning' ? '🟡' : '🔵';
      report += `${index + 1}. ${icon} **${issue.category.toUpperCase()}**: ${issue.message}\n`;
      if (issue.fix) {
        report += `   💡 *Solución*: ${issue.fix}\n`;
      }
      report += '\n';
    });
  }
  
  // Suggestions
  if (suggestions.length > 0) {
    report += `## Sugerencias de Mejora\n\n`;
    suggestions.forEach((suggestion, index) => {
      const impactIcon = suggestion.impact === 'high' ? '🔥' : 
                        suggestion.impact === 'medium' ? '⚡' : '💡';
      const difficultyIcon = suggestion.implementation === 'easy' ? '🟢' : 
                            suggestion.implementation === 'medium' ? '🟡' : '🔴';
      report += `${index + 1}. ${impactIcon} ${difficultyIcon} **${suggestion.category.toUpperCase()}**: ${suggestion.message}\n`;
      report += `   - Impacto: ${suggestion.impact} | Dificultad: ${suggestion.implementation}\n\n`;
    });
  }
  
  return report;
}

/**
 * Send AEO metrics to analytics
 */
export function trackAEOMetrics(metrics: AEOMetrics): void {
  // In a real implementation, this would send to your analytics service
  if (process.env.NODE_ENV === 'development') {
    console.group('AEO Metrics');
    console.table(metrics);
    console.groupEnd();
  }
  
  // Example: Send to Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag;
    gtag('event', 'aeo_analysis', {
      custom_map: {
        'aeo_score': metrics.hasJsonLd ? 100 : 0,
        'has_faq': metrics.hasFAQ,
        'faq_count': metrics.faqCount,
        'has_speakable': metrics.hasSpeakableMarkup,
      }
    });
  }
}

// Helper functions
function calculateAEOGrade(score: number): AEOValidationResult['grade'] {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

/**
 * AEO Testing utilities for development
 */
export const AEOTestUtils = {
  // Test if page has proper voice search optimization
  testVoiceSearchReadiness: () => {
    const speakableElements = document.querySelectorAll('[data-speakable="true"]');
    const faqSections = document.querySelectorAll('[itemtype*="FAQPage"]');
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    return {
      hasJsonLD: jsonLdScripts.length > 0,
      hasSpeakableContent: speakableElements.length > 0,
      hasFAQs: faqSections.length > 0,
      score: (
        (jsonLdScripts.length > 0 ? 1 : 0) +
        (speakableElements.length > 0 ? 1 : 0) +
        (faqSections.length > 0 ? 1 : 0)
      ) / 3 * 100
    };
  },
  
  // Extract all structured data from page
  extractStructuredData: () => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    return Array.from(scripts).map(script => {
      try {
        return JSON.parse(script.textContent || '');
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
  },
  
  // Validate FAQ structure
  validateFAQStructure: () => {
    const faqs = document.querySelectorAll('[itemtype*="Question"]');
    return Array.from(faqs).map((faq, index) => {
      const question = faq.querySelector('[itemprop="name"]')?.textContent || '';
      const answer = faq.querySelector('[itemprop="text"]')?.textContent || '';
      
      return {
        index: index + 1,
        question,
        answer,
        hasQuestionMark: question.includes('?'),
        answerLength: answer.length,
        isOptimalLength: answer.length >= 40 && answer.length <= 300,
      };
    });
  }
};

// Export for use in development tools
declare global {
  interface Window {
    AEOTestUtils: typeof AEOTestUtils;
  }
}

if (typeof window !== 'undefined') {
  window.AEOTestUtils = AEOTestUtils;
}