/**
 * Enhanced TL;DR Component with Advanced AEO Optimization
 * Optimized for voice search, featured snippets, and answer engines
 */

import React from 'react';
import { CONTENT_LIMITS, AEO_CONFIG } from '@/lib/constants';

interface EnhancedTLDRProps {
  content: string;
  title?: string;
  className?: string;
  showWordCount?: boolean;
  enableVoiceOptimization?: boolean;
  showAEOIndicators?: boolean;
  venue?: any; // For contextual optimization
  type?: 'paragraph' | 'answer' | 'summary';
}

export default function EnhancedTLDR({ 
  content, 
  title = 'TL;DR',
  className = '',
  showWordCount = false,
  enableVoiceOptimization = true,
  showAEOIndicators = process.env.NODE_ENV === 'development',
  venue,
  type = 'summary'
}: EnhancedTLDRProps) {
  // Analyze content for AEO optimization
  const wordCount = content.trim().split(/\s+/).length;
  const charCount = content.length;
  const isOptimalLength = wordCount >= CONTENT_LIMITS.tldr.min && wordCount <= CONTENT_LIMITS.tldr.max;
  const isVoiceOptimal = charCount <= AEO_CONFIG.voiceSearch.maxAnswerLength;
  
  // Check for answer format patterns
  const hasAnswerPattern = /\b(es|está|son|tienen|ofrece|especializa|destaca|recomiendo)\b/i.test(content);
  const hasQuestionWords = AEO_CONFIG.voiceSearch.questionPatterns.some(pattern => 
    content.toLowerCase().includes(pattern)
  );
  
  // Voice search readiness score
  const voiceReadinessScore = [
    isVoiceOptimal,
    hasAnswerPattern,
    wordCount >= 20 && wordCount <= 40,
    content.includes('.') && !content.includes('...'),
  ].filter(Boolean).length;

  // Validate content length for AEO
  if (!content || content.trim().length === 0) {
    return null;
  }

  // Generate structured data for the TL;DR
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Answer',
    text: content,
    // Voice search optimization
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.tldr-content', '.answer-text'],
    },
    // Answer format optimization
    ...(venue && {
      about: {
        '@type': 'Thing',
        name: venue.title || 'Local de interés',
      },
    }),
  };

  return (
    <>
      {/* Structured Data */}
      {enableVoiceOptimization && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 0) }}
        />
      )}
      
      <section 
        className={`tldr-section-enhanced ${className}`}
        aria-labelledby="tldr-heading"
        role="complementary"
        itemScope
        itemType="https://schema.org/Answer"
      >
        <div className={`
          ${type === 'answer' ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500' : ''}
          ${type === 'summary' ? 'bg-gradient-to-r from-primary-50 to-primary-100 border-l-4 border-primary-500' : ''}
          ${type === 'paragraph' ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500' : ''}
          rounded-lg p-6 shadow-sm
        `}>
          {/* Enhanced Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                  ${type === 'answer' ? 'bg-blue-500' : ''}
                  ${type === 'summary' ? 'bg-primary-500' : ''}
                  ${type === 'paragraph' ? 'bg-green-500' : ''}
                `}>
                  <span aria-hidden="true">
                    {type === 'answer' ? '💬' : type === 'summary' ? '⚡' : '📝'}
                  </span>
                </div>
              </div>
              <div>
                <h2 
                  id="tldr-heading"
                  className="text-lg font-bold text-gray-900"
                >
                  {title}
                  {enableVoiceOptimization && (
                    <span className="ml-2 text-xs bg-white bg-opacity-50 px-2 py-1 rounded-full">
                      🎙️ AEO
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-600">
                  {type === 'answer' ? 'Respuesta directa' : 'Resumen'} en {wordCount} palabras
                  {enableVoiceOptimization && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      voiceReadinessScore >= 3 
                        ? 'bg-green-100 text-green-800' 
                        : voiceReadinessScore >= 2 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      Voz: {voiceReadinessScore}/4
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Enhanced indicators */}
            {(showWordCount || showAEOIndicators) && (
              <div className="flex flex-col gap-2">
                <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                  isOptimalLength 
                    ? 'bg-green-100 text-green-800' 
                    : wordCount < CONTENT_LIMITS.tldr.min 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {wordCount} palabras
                  {!isOptimalLength && (
                    <span className="block text-xs opacity-75">
                      {wordCount < CONTENT_LIMITS.tldr.min 
                        ? `Mín: ${CONTENT_LIMITS.tldr.min}` 
                        : `Máx: ${CONTENT_LIMITS.tldr.max}`}
                    </span>
                  )}
                </div>
                
                {enableVoiceOptimization && (
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isVoiceOptimal ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    Voz: {isVoiceOptimal ? 'OK' : 'Largo'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Content */}
          <div 
            className="prose prose-lg max-w-none"
            itemProp="text"
          >
            <div 
              className={`
                text-gray-800 leading-relaxed font-medium text-base md:text-lg m-0 tldr-content answer-text
                ${type === 'answer' ? 'text-blue-900' : ''}
                ${type === 'paragraph' ? 'text-green-900' : ''}
              `}
              // Voice search optimization attributes
              data-speakable="true"
              data-answer-format={hasAnswerPattern ? 'true' : 'false'}
              data-voice-optimal={isVoiceOptimal ? 'true' : 'false'}
            >
              {content}
            </div>
          </div>

          {/* Voice Search Enhancement Notice */}
          {enableVoiceOptimization && (
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>Optimizado para asistentes de voz y búsquedas directas</span>
              {venue && (
                <span className="ml-2 text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                  Sobre: {venue.title}
                </span>
              )}
            </div>
          )}

          {/* AEO Optimization Details (Development only) */}
          {showAEOIndicators && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <span className={`px-2 py-1 rounded ${
                  isOptimalLength ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  AEO: {isOptimalLength ? 'Optimizado' : 'Mejorable'}
                </span>
                
                <span className={`px-2 py-1 rounded ${
                  isVoiceOptimal ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  Voz: {isVoiceOptimal ? 'Óptimo' : 'Largo'}
                </span>
                
                <span className={`px-2 py-1 rounded ${
                  hasAnswerPattern ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  Formato: {hasAnswerPattern ? 'Respuesta' : 'Narrativo'}
                </span>
                
                <span className={`px-2 py-1 rounded ${
                  voiceReadinessScore >= 3 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  Score: {voiceReadinessScore}/4
                </span>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Caracteres: {charCount} | 
                Patrón respuesta: {hasAnswerPattern ? '✓' : '✗'} | 
                Palabras pregunta: {hasQuestionWords ? '✓' : '✗'}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Enhanced Compact TLDR with voice optimization
export function CompactEnhancedTLDR({ 
  content, 
  className = '', 
  enableVoiceOptimization = true,
  type = 'answer'
}: { 
  content: string; 
  className?: string;
  enableVoiceOptimization?: boolean;
  type?: 'answer' | 'summary';
}) {
  const wordCount = content.trim().split(/\s+/).length;
  const isVoiceOptimal = content.length <= AEO_CONFIG.voiceSearch.maxAnswerLength;
  
  if (!content || content.trim().length === 0) {
    return null;
  }

  return (
    <div 
      className={`
        compact-tldr-enhanced rounded-lg p-4 border
        ${type === 'answer' ? 'bg-blue-50 border-blue-200' : 'bg-primary-50 border-primary-200'}
        ${className}
      `}
      itemScope
      itemType="https://schema.org/Answer"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <span className={`
            inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold
            ${type === 'answer' ? 'bg-blue-500' : 'bg-primary-500'}
          `}>
            {type === 'answer' ? '💬' : '⚡'}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {type === 'answer' ? 'Respuesta rápida' : 'Resumen rápido'}
            </h3>
            {enableVoiceOptimization && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                isVoiceOptimal ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                🎙️ {isVoiceOptimal ? 'OK' : 'Largo'}
              </span>
            )}
          </div>
          
          <p 
            className="text-sm text-gray-700 leading-relaxed"
            itemProp="text"
            data-speakable="true"
          >
            {content}
          </p>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{wordCount} palabras</span>
            {enableVoiceOptimization && (
              <span>🎙️ Optimizado para voz</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Answer format TLDR for featured snippets
export function AnswerFormatTLDR({ 
  question,
  answer,
  venue,
  className = '',
  enableVoiceOptimization = true
}: { 
  question: string;
  answer: string;
  venue?: any;
  className?: string;
  enableVoiceOptimization?: boolean;
}) {
  const answerWordCount = answer.split(' ').length;
  const isSnippetOptimal = answerWordCount <= AEO_CONFIG.featuredSnippets.paragraphLength;

  return (
    <div 
      className={`answer-format-tldr bg-white border-2 border-blue-200 rounded-lg p-6 ${className}`}
      itemScope
      itemType="https://schema.org/Question"
    >
      <h3 
        className="text-lg font-semibold text-blue-900 mb-3 faq-question"
        itemProp="name"
      >
        {question}
      </h3>
      
      <div 
        className="text-gray-800 leading-relaxed faq-answer answer-text"
        itemScope
        itemType="https://schema.org/Answer"
        itemProp="acceptedAnswer"
      >
        <div 
          itemProp="text"
          data-speakable="true"
          data-answer-format="true"
        >
          {answer}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          {enableVoiceOptimization && (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>Formato de respuesta directa</span>
            </>
          )}
        </div>
        
        <div className="flex gap-2 text-xs">
          <span className={`px-2 py-1 rounded-full ${
            isSnippetOptimal ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {answerWordCount}w {isSnippetOptimal ? '✓' : '⚠'}
          </span>
          {venue && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              {venue.title}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}