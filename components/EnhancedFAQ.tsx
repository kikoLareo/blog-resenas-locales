'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { FAQ } from '@/lib/types';
import { faqJsonLd, renderJsonLd } from '@/lib/schema';

interface EnhancedFAQProps extends React.HTMLAttributes<HTMLElement> {
  faqs?: FAQ[];
  items?: FAQ[]; // Alias for compatibility
  title?: string;
  className?: string;
  allowMultipleOpen?: boolean;
  context?: 'venue' | 'city' | 'category' | 'general';
  contextData?: { name?: string; cityName?: string };
  showVoiceSearchHint?: boolean;
  showStructuredData?: boolean;
  'data-testid'?: string;
}

export default function EnhancedFAQ({ 
  faqs, 
  items,
  title = 'Preguntas frecuentes',
  className = '',
  allowMultipleOpen = true,
  context = 'general',
  contextData,
  showVoiceSearchHint = true,
  showStructuredData = true,
  ...rest
}: EnhancedFAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  // Normalize data source
  const list: FAQ[] | undefined = faqs ?? items;

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    
    if (allowMultipleOpen) {
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        newOpenItems.add(index);
      }
    } else {
      if (newOpenItems.has(index)) {
        newOpenItems.clear();
      } else {
        newOpenItems.clear();
        newOpenItems.add(index);
      }
    }
    
    setOpenItems(newOpenItems);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(index);
    }
  };

  if (!list || list.length === 0) {
    return null;
  }
  
  // Generate JSON-LD schema for FAQs (voice search optimized)
  const faqSchema = showStructuredData ? faqJsonLd(list) : null;

  // Voice search optimized questions for suggestions
  const voiceSearchExamples = [
    `¿Dónde puedo comer ${contextData?.name ? `en ${contextData.name}` : 'cerca de mí'}?`,
    '¿Qué restaurantes están abiertos ahora?',
    '¿Cuál es el mejor restaurante de la zona?',
    '¿Necesito reserva para este restaurante?'
  ];

  return (
    <section 
      className={`enhanced-faq ${className}`}
      aria-labelledby="faq-heading"
      role="region"
      itemScope
      itemType="https://schema.org/FAQPage"
      data-testid={rest['data-testid'] ?? 'enhanced-faq'}
      {...rest}
    >
    
      {/* JSON-LD Schema for Voice Search */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(faqSchema) || '' }}
        />
      )}

      {/* Voice Search Hint */}
      {showVoiceSearchHint && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <MicrophoneIcon className="w-6 h-6 text-blue-600 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                💬 Optimizado para búsqueda por voz
              </h3>
              <p className="text-sm text-blue-800 mb-2">
                Puedes preguntar directamente usando tu asistente de voz. Prueba con:
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                {voiceSearchExamples.slice(0, 2).map((example, index) => (
                  <div key={index} className="italic">
                    &ldquo;Hey Google, {example}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Header - Optimized for featured snippets */}
      <div className="mb-8">
        <h2 
          id="faq-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
          itemProp="name"
        >
          {title}
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed" itemProp="description">
            Encuentra respuestas rápidas a las preguntas más comunes
            {contextData?.name && ` sobre ${contextData.name}`}
            {contextData?.cityName && ` en ${contextData.cityName}`}.
            Nuestras respuestas están optimizadas para búsquedas por voz y asistentes digitales.
          </p>
        </div>
      </div>

      {/* FAQ Items - Structured for voice search and featured snippets */}
      <div className="space-y-4" aria-labelledby="faq-heading">
        {list.map((faq, index) => {
          const isOpen = openItems.has(index);
          const buttonId = `faq-item-${index}`;
          const panelId = `faq-content-${index}`;

          return (
            <article
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary-300"
              itemScope
              itemType="https://schema.org/Question"
              itemProp="mainEntity"
            >
              {/* Question Button - Voice search friendly */}
              <button
                id={buttonId}
                className="faq-question w-full px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg group"
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                type="button"
              >
                <div className="flex items-start justify-between">
                  <h3 
                    className="text-lg font-semibold text-gray-900 pr-4 leading-relaxed group-hover:text-primary-700 transition-colors"
                    itemProp="name"
                  >
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 mt-1">
                    {isOpen ? (
                      <ChevronUpIcon 
                        className="w-5 h-5 text-primary-600 group-hover:text-primary-700 transition-colors" 
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDownIcon 
                        className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" 
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              </button>

              {/* Answer Panel - Optimized for featured snippets */}
              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div className="px-6 pb-5 border-t border-gray-100">
                    <div 
                      className="pt-4 text-gray-700 leading-relaxed prose prose-sm max-w-none"
                      itemProp="text"
                    >
                      {/* Render answer with proper formatting for voice search */}
                      <div
                        dangerouslySetInnerHTML={{ 
                          __html: formatAnswerForVoiceSearch(faq.answer) 
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Enhanced FAQ Footer with voice search tips */}
      <div className="mt-10 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            Estamos aquí para ayudarte con cualquier pregunta adicional. 
            También puedes usar búsqueda por voz preguntando directamente a tu asistente.
          </p>
          
          {/* Voice search examples */}
          {showVoiceSearchHint && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Ejemplos de búsqueda por voz:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                {voiceSearchExamples.map((example, index) => (
                  <div key={index} className="italic bg-gray-50 p-2 rounded">
                    &ldquo;{example}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
            >
              Contactar
            </Link>
            <Link
              href="/buscar"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              Buscar más respuestas
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              Ver artículos del blog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Format answer text for better voice search optimization
 */
function formatAnswerForVoiceSearch(answer: string): string {
  return answer
    // Add proper paragraph breaks
    .replace(/\. ([A-Z])/g, '.</p><p>$1')
    // Wrap in paragraph tags if not already wrapped
    .replace(/^(?!<p>)([\s\S]+)(?!<\/p>)$/, '<p>$1</p>')
    // Add emphasis to key phrases
    .replace(/\b(recomendamos|importante|esencial|obligatorio|siempre)\b/gi, '<strong>$1</strong>')
    // Add semantic emphasis to numbers and ranges
    .replace(/(\d+[-–]\d+€?)/g, '<strong>$1</strong>')
    .replace(/(\d+:\d+)/g, '<strong>$1</strong>')
    // Add breaks for better reading flow
    .replace(/\n/g, '<br />');
}

/**
 * Compact Enhanced FAQ variant for sidebars or smaller spaces
 */
export function CompactEnhancedFAQ({ 
  faqs, 
  className = '',
  maxItems = 5,
  showVoiceHint = false 
}: { 
  faqs: FAQ[]; 
  className?: string;
  maxItems?: number;
  showVoiceHint?: boolean;
}) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.clear();
    } else {
      newOpenItems.clear();
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className={`compact-enhanced-faq ${className}`} itemScope itemType="https://schema.org/FAQPage">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          FAQ
        </h3>
        {showVoiceHint && (
          <MicrophoneIcon className="w-4 h-4 text-blue-600" title="Optimizado para búsqueda por voz" />
        )}
      </div>
      
      <div className="space-y-3">
        {faqs.slice(0, maxItems).map((faq, index) => {
          const isOpen = openItems.has(index);
          
          return (
            <article
              key={index}
              className="border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              itemScope
              itemType="https://schema.org/Question"
              itemProp="mainEntity"
            >
              <button
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg transition-colors"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                type="button"
              >
                <div className="flex items-center justify-between">
                  <span className="pr-2" itemProp="name">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUpIcon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>
              {isOpen && (
                <div 
                  className="px-4 pb-3 border-t border-gray-100"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <p className="pt-2 text-sm text-gray-600 leading-relaxed" itemProp="text">
                    {faq.answer}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
      
      {faqs.length > maxItems && (
        <div className="mt-4 text-center">
          <Link 
            href="#faq" 
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todas las preguntas ({faqs.length})
          </Link>
        </div>
      )}
    </div>
  );
}