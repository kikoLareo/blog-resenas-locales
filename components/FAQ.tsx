'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  className?: string;
  'data-testid'?: string;
}

export default function FAQ({ 
  items, 
  title = 'Preguntas frecuentes',
  className = '',
  'data-testid': testId = 'faq'
}: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section 
      className={`faq ${className}`}
      data-testid={testId}
      aria-labelledby="faq-heading"
    >
      <h2 
        id="faq-heading" 
        className="text-2xl font-semibold text-gray-900 mb-6"
      >
        {title}
      </h2>
      
      <div className="space-y-4">
        {items.map((item, index) => {
          const isOpen = openItems.includes(index);
          const itemId = `faq-item-${index}`;
          const contentId = `faq-content-${index}`;
          
          return (
            <div 
              key={index} 
              className="faq-item border border-gray-200 rounded-lg overflow-hidden"
              itemScope
              itemType="https://schema.org/Question"
            >
              <button
                type="button"
                className={`faq-question w-full px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset transition-colors ${
                  isOpen ? 'bg-gray-50' : 'bg-white'
                }`}
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                id={itemId}
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="text-lg leading-relaxed pr-4"
                    itemProp="name"
                  >
                    {item.question}
                  </span>
                  <span className="flex-shrink-0 ml-2">
                    {isOpen ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                    )}
                  </span>
                </div>
              </button>
              
              {isOpen && (
                <div
                  id={contentId}
                  className="faq-answer px-6 pb-4 text-gray-700 leading-relaxed"
                  role="region"
                  aria-labelledby={itemId}
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <div itemProp="text">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* FAQ JSON-LD is handled at page level */}
    </section>
  );
}
