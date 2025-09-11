/**
 * Enhanced FAQ Component with Voice Search Optimization
 * Optimized for Answer Engine Optimization (AEO) and featured snippets
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FAQ as FAQType } from '@/lib/types';
import { validateAEOContent, generateQuestionVariations } from '@/lib/voice-search';

interface EnhancedFAQProps extends React.HTMLAttributes<HTMLElement> {
  faqs?: FAQType[];
  items?: FAQType[]; // Alias for compatibility
  title?: string;
  className?: string;
  allowMultipleOpen?: boolean;
  enableVoiceOptimization?: boolean;
  showAEOIndicators?: boolean;
  venue?: any; // For contextual optimization
}

interface FAQValidation {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

export default function EnhancedFAQ({ 
  faqs, 
  items,
  title = 'Preguntas frecuentes',
  className = '',
  allowMultipleOpen = true,
  enableVoiceOptimization = true,
  showAEOIndicators = process.env.NODE_ENV === 'development',
  venue,
  ...rest
}: EnhancedFAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [validation, setValidation] = useState<FAQValidation | null>(null);
  
  const list = useMemo(() => faqs || items || [], [faqs, items]);
  
  // Validate FAQs for AEO compliance
  useEffect(() => {
    if (showAEOIndicators && list.length > 0) {
      const validationResult = validateAEOContent({ faqs: list });
      setValidation(validationResult);
    }
  }, [list, showAEOIndicators]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultipleOpen) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
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
  
  // Generate JSON-LD schema for FAQs with AEO optimizations
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      text: faq.question,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        // Voice search optimization
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.faq-answer', '.answer-text'],
        },
      },
      // Question variations for better voice search coverage
      ...(enableVoiceOptimization && {
        alternateName: generateQuestionVariations(faq.question, venue),
      }),
    })),
    // Page-level voice search optimization
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.faq-section', '.faq-question', '.faq-answer'],
    },
    about: {
      '@type': 'Thing',
      name: venue ? `Preguntas sobre ${venue.title}` : 'Preguntas frecuentes',
    },
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 0) }}
      />
      
      <section 
        className={`faq faq-enhanced ${className}`}
        aria-labelledby="faq-heading"
        role="region"
        itemScope
        itemType="https://schema.org/FAQPage"
        {...rest}
      >
        {/* FAQ Header with AEO indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 
              id="faq-heading"
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            >
              {title}
            </h2>
            
            {/* AEO Validation Indicators (Development only) */}
            {showAEOIndicators && validation && (
              <div className="flex flex-col gap-1">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  validation.isValid 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  AEO: {validation.isValid ? 'Optimizado' : 'Necesita mejoras'}
                </div>
                <div className="text-xs text-gray-500">
                  {list.length} preguntas
                </div>
              </div>
            )}
          </div>
          
          {/* Voice Search Optimization Notice */}
          {enableVoiceOptimization && (
            <p className="text-gray-600 text-sm mb-4">
              ✨ Optimizado para búsqueda por voz y asistentes de IA
            </p>
          )}
          
          {/* AEO Issues (Development only) */}
          {showAEOIndicators && validation && validation.issues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Mejoras sugeridas:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {validation.issues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
                {validation.suggestions.map((suggestion, index) => (
                  <li key={`suggestion-${index}`}>💡 {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {list.map((faq, index) => {
            const isOpen = openItems.has(index);
            const buttonId = `faq-button-${index}`;
            const panelId = `faq-panel-${index}`;
            
            // Calculate answer length for AEO validation
            const answerWordCount = faq.answer.split(' ').length;
            const isOptimalLength = answerWordCount >= 8 && answerWordCount <= 50;
            const hasQuestionMark = faq.question.includes('?');

            return (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                itemScope
                itemType="https://schema.org/Question"
              >
                {/* Question Button */}
                <button
                  id={buttonId}
                  type="button"
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded-xl"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  <div className="flex-1">
                    <h3 
                      className="text-lg font-semibold text-gray-900 pr-4 leading-relaxed faq-question"
                      itemProp="name"
                    >
                      {faq.question}
                    </h3>
                    
                    {/* AEO Indicators (Development only) */}
                    {showAEOIndicators && (
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          hasQuestionMark 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {hasQuestionMark ? '?' : 'Sin ?'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isOptimalLength 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {answerWordCount}w
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Expand/Collapse Icon */}
                  <div className={`flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}>
                    <svg 
                      className="w-6 h-6 text-gray-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </div>
                </button>

                {/* Answer Panel */}
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="overflow-hidden transition-all duration-300 ease-in-out max-h-96 opacity-100"
                    itemScope
                    itemType="https://schema.org/Answer"
                    itemProp="acceptedAnswer"
                  >
                    <div className="px-6 pb-6">
                      <div 
                        className="text-gray-700 leading-relaxed prose prose-sm max-w-none faq-answer answer-text"
                        itemProp="text"
                        // Voice search optimization: Add speakable class
                        data-speakable="true"
                        dangerouslySetInnerHTML={{ 
                          __html: faq.answer.replace(/\n/g, '<br />') 
                        }}
                      />
                      
                      {/* Voice Search Enhancement */}
                      {enableVoiceOptimization && (
                        <div className="mt-3 text-xs text-gray-500">
                          🎙️ Respuesta optimizada para asistentes de voz
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ Footer with Voice Search Tips */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Tienes más preguntas?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Estas preguntas están optimizadas para búsqueda por voz. 
                Puedes preguntarle a tu asistente virtual sobre cualquiera de estos temas.
              </p>
              
              {/* Voice Search Examples */}
              {enableVoiceOptimization && venue && (
                <div className="bg-white bg-opacity-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Prueba preguntar:
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• &ldquo;Hey Google, ¿dónde está {venue.title}?&rdquo;</div>
                    <div>• &ldquo;Alexa, ¿cuál es el horario de {venue.title}?&rdquo;</div>
                    <div>• &ldquo;Siri, ¿es bueno {venue.title}?&rdquo;</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Compact FAQ variant for sidebars with AEO optimization
export function CompactEnhancedFAQ({ 
  faqs, 
  className = '',
  enableVoiceOptimization = true 
}: { 
  faqs: FAQType[]; 
  className?: string;
  enableVoiceOptimization?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`compact-faq-enhanced ${className}`} itemScope itemType="https://schema.org/FAQPage">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">❓</span>
        Preguntas rápidas
        {enableVoiceOptimization && (
          <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
            🎙️ AEO
          </span>
        )}
      </h3>
      
      <div className="space-y-3">
        {faqs.slice(0, 5).map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
              itemScope
              itemType="https://schema.org/Question"
            >
              <button
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                itemProp="name"
              >
                <div className="flex items-center justify-between">
                  <span className="faq-question">{faq.question}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {isOpen && (
                <div 
                  className="px-4 pb-3"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <p 
                    className="text-sm text-gray-600 leading-relaxed faq-answer"
                    itemProp="text"
                    data-speakable="true"
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}