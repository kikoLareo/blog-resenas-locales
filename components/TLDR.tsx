import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface TLDRProps {
  text: string;
  title?: string;
  className?: string;
  'data-testid'?: string;
}

export default function TLDR({ 
  text, 
  title = 'Resumen rápido',
  className = '',
  'data-testid': testId = 'tldr'
}: TLDRProps) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  return (
    <div 
      className={`tldr ${className}`}
      data-testid={testId}
      role="complementary"
      aria-labelledby="tldr-heading"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <InformationCircleIcon 
            className="w-6 h-6 text-blue-600 mt-0.5" 
            aria-hidden="true"
          />
        </div>
        <div className="flex-1">
          <h3 
            id="tldr-heading"
            className="tldr-title text-lg font-semibold text-blue-900 mb-2"
          >
            {title}
          </h3>
          <div 
            className="tldr-content text-blue-800 leading-relaxed"
            itemProp="abstract"
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}
