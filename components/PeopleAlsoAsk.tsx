'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface PAAQuestion {
  question: string;
  answer: string;
  category?: 'location' | 'hours' | 'price' | 'booking' | 'general';
}

interface PeopleAlsoAskProps {
  questions: PAAQuestion[];
  title?: string;
  className?: string;
  maxVisible?: number;
  showCategories?: boolean;
}

const categoryIcons = {
  location: '📍',
  hours: '🕒', 
  price: '💰',
  booking: '📞',
  general: '❓',
};

const categoryColors = {
  location: 'bg-green-50 text-green-700 border-green-200',
  hours: 'bg-blue-50 text-blue-700 border-blue-200',
  price: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  booking: 'bg-purple-50 text-purple-700 border-purple-200',
  general: 'bg-gray-50 text-gray-700 border-gray-200',
};

export default function PeopleAlsoAsk({
  questions,
  title = 'La gente también pregunta',
  className = '',
  maxVisible = 6,
  showCategories = false,
}: PeopleAlsoAskProps) {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleQuestions = showAll ? questions : questions.slice(0, maxVisible);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  if (!questions.length) return null;

  // Generate structured data for PAA
  const paaSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <section className={`people-also-ask ${className}`} aria-labelledby="paa-heading">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(paaSchema) }}
      />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <QuestionMarkCircleIcon className="w-6 h-6 text-primary-600" />
          <h2 id="paa-heading" className="text-xl font-bold text-gray-900">
            {title}
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Preguntas frecuentes optimizadas para búsquedas por voz y asistentes digitales
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {visibleQuestions.map((paaItem, index) => {
          const isOpen = openQuestion === index;
          const category = paaItem.category || 'general';
          
          return (
            <article
              key={index}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
              itemScope
              itemType="https://schema.org/Question"
            >
              <button
                className="w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                onClick={() => toggleQuestion(index)}
                aria-expanded={isOpen}
                type="button"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Category Badge */}
                    {showCategories && (
                      <div className="mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${categoryColors[category]}`}>
                          {categoryIcons[category]} 
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                      </div>
                    )}
                    
                    {/* Question */}
                    <h3 
                      className="font-medium text-gray-900 leading-relaxed pr-2"
                      itemProp="name"
                    >
                      {paaItem.question}
                    </h3>
                  </div>
                  
                  {/* Toggle Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {isOpen ? (
                      <ChevronUpIcon className="w-5 h-5 text-primary-600" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Answer */}
              {isOpen && (
                <div 
                  className="px-4 pb-4 border-t border-gray-100"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div className="pt-3">
                    <p 
                      className="text-gray-700 leading-relaxed"
                      itemProp="text"
                      dangerouslySetInnerHTML={{ 
                        __html: formatPAAAnswer(paaItem.answer) 
                      }}
                    />
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Show More Button */}
      {questions.length > maxVisible && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            type="button"
          >
            {showAll ? (
              <>
                <ChevronUpIcon className="w-4 h-4" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4" />
                Ver {questions.length - maxVisible} preguntas más
              </>
            )}
          </button>
        </div>
      )}

      {/* Voice Search Tip */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎤</div>
          <div>
            <h4 className="font-semibold text-blue-900 text-sm mb-1">
              Tip: Búsqueda por voz
            </h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              Puedes hacer estas preguntas directamente a tu asistente de voz. 
              Ejemplo: &ldquo;Hey Google, {questions[0]?.question.toLowerCase()}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Compact PAA for smaller spaces
 */
export function CompactPeopleAlsoAsk({
  questions,
  maxItems = 3,
  className = '',
}: {
  questions: PAAQuestion[];
  maxItems?: number;
  className?: string;
}) {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  if (!questions.length) return null;

  return (
    <div className={`compact-paa ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <QuestionMarkCircleIcon className="w-5 h-5 text-primary-600" />
        Preguntas frecuentes
      </h3>
      
      <div className="space-y-2">
        {questions.slice(0, maxItems).map((item, index) => {
          const isOpen = openQuestion === index;
          
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-md"
            >
              <button
                className="w-full p-3 text-left text-sm hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setOpenQuestion(isOpen ? null : index)}
                type="button"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 pr-2">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUpIcon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>
              
              {isOpen && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <p className="pt-2 text-sm text-gray-600 leading-relaxed">
                    {item.answer}
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

/**
 * Format PAA answers for better readability and voice search
 */
function formatPAAAnswer(answer: string): string {
  return answer
    // Emphasize key information
    .replace(/\b(horarios?|precios?|dirección|teléfono|reserva)\b/gi, '<strong>$1</strong>')
    // Format phone numbers
    .replace(/(\d{3}\s?\d{3}\s?\d{3})/g, '<strong>$1</strong>')
    // Format times
    .replace(/(\d{1,2}:\d{2})/g, '<strong>$1</strong>')
    // Format prices
    .replace(/(\d+€)/g, '<strong>$1</strong>')
    // Add line breaks
    .replace(/\. ([A-Z])/g, '.<br><br>$1')
    .trim();
}