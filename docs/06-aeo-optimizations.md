# 06. Answer Engine Optimization (AEO)

## Resumen

Esta documentación describe las optimizaciones avanzadas de AEO implementadas para mejorar el posicionamiento en motores de respuesta y búsquedas por voz.

## Objetivos

- **Ampliar schemas estructurados** para mejorar el SEO
- **Mejorar FAQs** con preguntas más relevantes y optimizadas para voz
- **Optimizar contenido y marcado** para búsquedas por voz y asistentes de IA
- **Analizar impacto** y documentar resultados

## Implementaciones

### 1. Schemas Estructurados Ampliados

#### Nuevos Tipos de Schema
- **QAPage**: Para páginas de preguntas y respuestas
- **HowTo**: Para guías paso a paso
- **MenuSection**: Para menús de restaurantes
- **Event**: Para eventos y promociones

#### Propiedades AEO Agregadas
- `speakable`: Marca contenido como apto para voz
- `about`: Define el tema principal
- `mentions`: Menciona temas relacionados
- `knowsAbout`: Conocimiento específico del negocio

### 2. Optimización para Búsqueda por Voz

#### Patrones de Pregunta Naturales
```typescript
// Ejemplos de patrones implementados
const VOICE_PATTERNS = {
  location: '¿Dónde está {venue}?',
  hours: '¿A qué hora abre {venue}?',
  pricing: '¿Cuánto cuesta comer en {venue}?',
  quality: '¿Es bueno {venue}?',
}
```

#### Contenido Speakable
- Selectors CSS específicos para asistentes de voz
- Contenido optimizado para respuestas de 40-55 palabras
- Formato conversacional y directo

### 3. FAQs Mejoradas

#### Características Nuevas
- **Validación AEO**: Comprueba longitud óptima de respuestas
- **Variaciones de preguntas**: Múltiples formas de preguntar lo mismo
- **Contexto de venue**: FAQs generadas dinámicamente por local
- **Indicadores de desarrollo**: Muestra métricas en tiempo real

#### Ejemplo de FAQ Optimizada
```typescript
{
  question: "¿Dónde está Restaurante Exemplo?",
  answer: "Restaurante Exemplo está en Calle Ficticia 123, Santiago de Compostela, Galicia.",
  questionVariations: [
    "¿Cómo llegar a Restaurante Exemplo?",
    "Ubicación de Restaurante Exemplo",
    "¿Cuál es la dirección de Restaurante Exemplo?"
  ],
  voiceOptimized: true,
  featuredSnippetReady: true
}
```

### 4. TL;DR Mejorado

#### Nuevas Características
- **Formato de respuesta directa**: Optimizado para featured snippets
- **Validación de longitud**: 20-50 palabras ideal para voz
- **Score de preparación para voz**: Métrica de 0-4 puntos
- **Tipos especializados**: `answer`, `summary`, `paragraph`

#### Indicadores AEO
- Longitud óptima de palabras
- Formato de respuesta validado
- Preparación para voz evaluada
- Compatibilidad con asistentes

### 5. Monitoreo de Performance

#### Métricas Rastreadas
```typescript
interface AEOMetrics {
  hasJsonLd: boolean;
  hasSpeakableMarkup: boolean;
  faqCount: number;
  voiceReadinessScore: number;
  snippetOptimizationScore: number;
}
```

#### Validación Automática
- Score de 0-100 para conformidad AEO
- Detección automática de problemas
- Sugerencias de mejora contextuales
- Reportes de rendimiento detallados

### 6. Utilidades de Desarrollo

#### Herramientas de Testing
```javascript
// Accesibles en consola del navegador
window.AEOTestUtils.testVoiceSearchReadiness();
window.AEOTestUtils.extractStructuredData();
window.AEOTestUtils.validateFAQStructure();
```

#### Validación de Contenido
- Verificación de longitud de respuestas
- Detección de patrones de pregunta
- Análisis de preparación para voz
- Evaluación de structured data

## Componentes Nuevos

### 1. EnhancedFAQ
Reemplazo del componente FAQ original con:
- Optimizaciones para voz integradas
- Validación AEO automática
- Indicadores de rendimiento
- Soporte para variaciones de preguntas

### 2. TldrEnhanced
TL;DR mejorado con:
- Múltiples formatos (`answer`, `summary`, `paragraph`)
- Validación de preparación para voz
- Score de optimización en tiempo real
- Structured data automático

### 3. Utilidades AEO

#### VoiceSearchUtils
```typescript
// Generar FAQs optimizadas para voz
generateVoiceSearchFAQs(venue, reviews);

// Optimizar contenido para featured snippets  
optimizeForFeaturedSnippets(content, 'paragraph');

// Validar contenido AEO
validateAEOContent({ title, description, faqs });
```

## Configuración

### Constants Añadidas
```typescript
export const AEO_CONFIG = {
  voiceSearch: {
    enabled: true,
    maxAnswerLength: 300,
    questionPatterns: ['cómo', 'qué', 'cuál', 'dónde']
  },
  featuredSnippets: {
    paragraphLength: 50,
    listItemCount: 8
  },
  performance: {
    aeoScoreThreshold: 80
  }
}
```

## Uso en Páginas

### Venue Pages
```typescript
// Schemas ampliados con AEO
const schemas = [
  localBusinessJsonLd(venue), // Con knowsAbout y keywords
  menuSectionJsonLd(venue, menuSections), // Nuevo
  eventJsonLd(upcomingEvents) // Nuevo
];

// FAQs generadas dinámicamente
const voiceFAQs = generateVoiceSearchFAQs(venue, reviews);
```

### Review Pages  
```typescript
// TL;DR optimizado para voz
<EnhancedTLDR 
  content={review.tldr}
  type="answer"
  enableVoiceOptimization={true}
  venue={venue}
/>

// FAQs con validación AEO
<EnhancedFAQ
  faqs={review.faq}
  enableVoiceOptimization={true}
  showAEOIndicators={isDev}
  venue={venue}
/>
```

### Blog Pages
```typescript
// Artículos con schema ampliado
const articleSchema = articleJsonLd(post); // Con speakable y about

// QA Page para artículos tipo guía
const qaSchema = qaPageJsonLd(
  "¿Cómo elegir el mejor restaurante?",
  post.tldr,
  relatedQuestions
);
```

## Métricas y Análisis

### Score AEO
- **A+ (95-100)**: Excelente optimización
- **A (85-94)**: Muy buena optimización  
- **B+ (80-84)**: Buena optimización
- **B (70-79)**: Optimización aceptable
- **C (60-69)**: Necesita mejoras
- **D-F (<60)**: Requiere trabajo significativo

### Validaciones Clave
1. **Schema.org completo** con speakable markup
2. **FAQs con 3-8 preguntas** de 40-300 caracteres
3. **TL;DR de 20-50 palabras** en formato respuesta
4. **Contenido conversacional** con patrones de pregunta
5. **Performance óptima** (<300ms para AEO)

## Impacto Esperado

### SEO Tradicional
- Mejores rich results en SERPs
- Mayor visibilidad de featured snippets
- Mejor indexación de contenido estructurado

### Búsqueda por Voz
- Respuestas más precisas de asistentes de IA
- Mayor probabilidad de ser respuesta seleccionada
- Mejor experiencia en dispositivos móviles

### Answer Engines
- Optimización para ChatGPT, Bard, Bing Chat
- Mejor comprensión del contexto por IA
- Mayor relevancia para consultas específicas

## Próximos Pasos

1. **Monitorear métricas** de rendimiento AEO
2. **A/B testing** de diferentes formatos de FAQ
3. **Expansión de schemas** para más tipos de contenido
4. **Integración con analytics** para tracking detallado
5. **Optimización continua** basada en resultados

## Enlaces de Referencia

- [Schema.org Speakable Specification](https://schema.org/speakable)
- [Google Featured Snippets Guidelines](https://developers.google.com/search/docs/appearance/featured-snippets)
- [Voice Search Optimization Best Practices](https://developers.google.com/search/docs/appearance/voice-search)
- [Structured Data Testing Tool](https://search.google.com/test/rich-results)

---

*Documentación generada para el issue #120 - Advanced SEO optimizations for Answer Engine Optimization*