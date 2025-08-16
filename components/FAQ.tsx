'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps extends React.HTMLAttributes<HTMLElement> {
  faqs?: FAQItem[];
  // Alias para compatibilidad con tests: `items`
  items?: FAQItem[];
  title?: string;
  className?: string;
  allowMultipleOpen?: boolean;
}

export default function FAQ({ 
  faqs, 
  items,
  title = 'Preguntas frecuentes',
  className = '',
  allowMultipleOpen = true,
  ...rest
}: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  // Normalizar fuente de datos
  const list: FAQItem[] | undefined = faqs ?? items;

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    
    if (allowMultipleOpen) {
      // Allow multiple items to be open
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        newOpenItems.add(index);
      }
    } else {
      // Only allow one item to be open at a time
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
  
  // Generate JSON-LD schema for FAQs
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section 
      className={`faq ${className}`}
      aria-labelledby="faq-heading"
      role="region"
      data-testid={(rest as any)['data-testid'] ?? 'faq'}
      {...rest}
    >
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* FAQ Title */}
      <div className="mb-8">
        <h2 
          id="faq-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
        >
          {title}
        </h2>
        <p className="text-gray-600 text-lg">
          Encuentra respuestas rápidas a las preguntas más comunes
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4" aria-labelledby="faq-heading">
        {list.map((faq, index) => {
          const isOpen = openItems.has(index);
          const buttonId = `faq-item-${index}`;
          const panelId = `faq-content-${index}`;

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              itemScope
              itemType="https://schema.org/Question"
            >
              {/* Question Button */}
              <button
                id={buttonId}
                className="faq-question w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                type="button"
              >
                <div className="flex items-center justify-between">
                  <h3 
                    className="text-lg font-semibold text-gray-900 pr-4"
                    itemProp="name"
                  >
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {isOpen ? (
                      <ChevronUpIcon 
                        className="w-5 h-5 text-primary-600" 
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDownIcon 
                        className="w-5 h-5 text-gray-400" 
                        aria-hidden="true"
                      />
                    )}
                  </div>
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
                >
                  <div className="px-6 pb-4">
                    <div 
                      className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                      itemProp="text"
                      dangerouslySetInnerHTML={{ 
                        __html: faq.answer.replace(/\n/g, '<br />') 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ Footer */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-gray-600 mb-4">
            Estamos aquí para ayudarte con cualquier pregunta adicional
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contacto"
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Contactar
            </a>
            <a
              href="/blog"
              className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Ver más artículos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Compact FAQ variant for sidebars or smaller spaces
export function CompactFAQ({ faqs, className = '' }: { faqs: FAQItem[]; className?: string }) {
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
    <div className={`compact-faq ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        FAQ
      </h3>
      <div className="space-y-2">
        {faqs.slice(0, 5).map((faq, index) => {
          const isOpen = openItems.has(index);
          
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-md"
            >
              <button
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                type="button"
              >
                <div className="flex items-center justify-between">
                  <span className="pr-2">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUpIcon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
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
