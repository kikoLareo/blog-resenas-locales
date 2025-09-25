import { CONTENT_LIMITS } from '@/lib/constants';

interface TLDRProps {
  content: string;
  title?: string;
  className?: string;
  showWordCount?: boolean;
}

export default function TLDR({ 
  content, 
  title = 'TL;DR',
  className = '',
  showWordCount = false
}: TLDRProps) {
  // Count words for AEO validation
  const wordCount = content.trim().split(/\s+/).length;
  const isOptimalLength = wordCount >= CONTENT_LIMITS.tldr.min && wordCount <= CONTENT_LIMITS.tldr.max;

  // Validate content length for AEO
  if (!content || content.trim().length === 0) {
    return null;
  }

  return (
    <section 
      className={`tldr-section ${className}`}
      aria-labelledby="tldr-heading"
      role="complementary"
    >
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-l-4 border-primary-500 rounded-lg p-6 shadow-sm">
        {/* TLDR Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold" aria-hidden="true">
                  ⚡
                </span>
              </div>
            </div>
            <div>
              <h2 
                id="tldr-heading"
                className="text-lg font-bold text-gray-900"
              >
                {title}
              </h2>
              <p className="text-sm text-gray-600">
                Resumen en {wordCount} palabras
              </p>
            </div>
          </div>
          
          {/* Word count indicator for development */}
          {(showWordCount || process.env.NODE_ENV === 'development') && (
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
          )}
        </div>

        {/* TLDR Content */}
        <div 
          className="prose prose-lg max-w-none"
          itemScope
          itemType="https://schema.org/Article"
          itemProp="abstract"
        >
          <p 
            className="text-gray-800 leading-relaxed font-medium text-base md:text-lg m-0"
            itemProp="text"
          >
            {content}
          </p>
        </div>

        {/* AEO Optimization Indicators (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-4 border-t border-primary-200">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`px-2 py-1 rounded ${
                isOptimalLength ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                AEO: {isOptimalLength ? 'Optimizado' : 'Mejorable'}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Caracteres: {content.length}
              </span>
              <span className={`px-2 py-1 rounded ${
                content.includes('?') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                Pregunta: {content.includes('?') ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Compact TLDR variant for smaller spaces
export function CompactTLDR({ content, className = '' }: { content: string; className?: string }) {
  const wordCount = content.trim().split(/\s+/).length;
  
  if (!content || content.trim().length === 0) {
    return null;
  }

  return (
    <div className={`compact-tldr bg-primary-50 border border-primary-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-500 rounded-full text-white text-xs font-bold">
            ⚡
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Resumen rápido
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {content}
          </p>
          <span className="text-xs text-gray-500 mt-1 block">
            {wordCount} palabras
          </span>
        </div>
      </div>
    </div>
  );
}

// TLDR for review cards
export function ReviewTLDR({ 
  content, 
  rating, 
  className = '' 
}: { 
  content: string; 
  rating?: number; 
  className?: string;
}) {
  if (!content || content.trim().length === 0) {
    return null;
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (rating >= 4) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={`review-tldr border rounded-lg p-4 ${
      rating ? getRatingColor(rating) : 'bg-gray-50 border-gray-200'
    } ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold">
          En resumen
        </h4>
        {rating && (
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-white bg-opacity-50">
            {rating}/10
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed">
        {content}
      </p>
    </div>
  );
}
