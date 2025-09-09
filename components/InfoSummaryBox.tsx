'use client';

import Link from 'next/link';
import { 
  MapPinIcon, 
  ClockIcon, 
  PhoneIcon, 
  CurrencyEuroIcon,
  StarIcon,
  GlobeAltIcon,
  ExternalLinkIcon
} from '@heroicons/react/24/outline';
import { Venue, Review } from '@/lib/types';

interface InfoSummaryBoxProps {
  venue: Venue;
  review?: Review;
  className?: string;
  variant?: 'default' | 'compact' | 'featured-snippet';
  showActions?: boolean;
  voiceOptimized?: boolean;
}

export default function InfoSummaryBox({
  venue,
  review,
  className = '',
  variant = 'default',
  showActions = true,
  voiceOptimized = true,
}: InfoSummaryBoxProps) {
  
  // Calculate average rating from review if available
  const avgRating = review ? (
    review.ratings.food + 
    review.ratings.service + 
    review.ratings.ambience + 
    review.ratings.value
  ) / 4 : venue.avgRating;

  const ratingText = avgRating 
    ? avgRating >= 8 ? 'Excelente' : avgRating >= 6 ? 'Muy bueno' : avgRating >= 4 ? 'Bueno' : 'Regular'
    : null;

  // Generate structured data for the summary
  const summarySchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: venue.title,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      addressLocality: venue.city.title,
      addressCountry: 'ES',
    },
    telephone: venue.phone,
    url: venue.website,
    priceRange: venue.priceRange,
    ...(avgRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        bestRating: 10,
        reviewCount: venue.reviewCount || 1,
      },
    }),
  };

  const compactMode = variant === 'compact';
  const featuredSnippetMode = variant === 'featured-snippet';

  return (
    <div className={`info-summary-box ${className}`}>
      {/* Structured Data for Voice Search */}
      {voiceOptimized && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(summarySchema) }}
        />
      )}

      <div className={`
        bg-white border border-gray-200 rounded-lg shadow-sm
        ${featuredSnippetMode ? 'p-6' : compactMode ? 'p-4' : 'p-6'}
      `}>
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`
                font-bold text-gray-900 leading-tight
                ${featuredSnippetMode ? 'text-2xl' : compactMode ? 'text-lg' : 'text-xl'}
              `}>
                {venue.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">
                  {venue.categories.map(c => c.title).join(' • ')}
                </span>
                {!compactMode && (
                  <span className="text-sm font-medium text-primary-600">
                    {venue.priceRange}
                  </span>
                )}
              </div>
            </div>
            
            {avgRating && (
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-lg text-gray-900">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">/10</span>
                </div>
                {ratingText && (
                  <div className="text-sm font-medium text-gray-600">
                    {ratingText}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Info Grid - Optimized for Featured Snippets */}
        <div className={`
          grid gap-4 mb-4
          ${featuredSnippetMode ? 'grid-cols-1 space-y-3' : 
            compactMode ? 'grid-cols-1 space-y-2' : 
            'grid-cols-1 sm:grid-cols-2'}
        `}>
          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-900">Dirección</dt>
              <dd className="text-sm text-gray-700 mt-1">
                {venue.address}
                <br />
                <span className="text-gray-600">{venue.city.title}</span>
              </dd>
            </div>
          </div>

          {/* Hours */}
          {venue.openingHours && venue.openingHours.length > 0 && (
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <dt className="text-sm font-medium text-gray-900">Horarios</dt>
                <dd className="text-sm text-gray-700 mt-1">
                  {compactMode ? (
                    <div>{venue.openingHours[0]}</div>
                  ) : (
                    venue.openingHours.map((hours, index) => (
                      <div key={index}>{hours}</div>
                    ))
                  )}
                </dd>
              </div>
            </div>
          )}

          {/* Phone */}
          {venue.phone && (
            <div className="flex items-start gap-3">
              <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <dt className="text-sm font-medium text-gray-900">Teléfono</dt>
                <dd className="text-sm text-gray-700 mt-1">
                  <Link 
                    href={`tel:${venue.phone}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {venue.phone}
                  </Link>
                </dd>
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="flex items-start gap-3">
            <CurrencyEuroIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-900">Rango de precio</dt>
              <dd className="text-sm text-gray-700 mt-1">
                <span className="font-medium">{venue.priceRange}</span>
                {!compactMode && (
                  <span className="text-gray-600 ml-2">
                    {getPriceRangeText(venue.priceRange)}
                  </span>
                )}
              </dd>
            </div>
          </div>
        </div>

        {/* Featured Snippet Content */}
        {featuredSnippetMode && voiceOptimized && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              ¿Qué tal está {venue.title}?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {venue.title} es un {venue.categories[0]?.title.toLowerCase() || 'restaurante'} {' '}
              {getPriceRangeDescription(venue.priceRange)} en {venue.city.title}
              {avgRating ? ` con una puntuación de ${avgRating.toFixed(1)}/10` : ''}.
              {venue.description && ` ${venue.description}`}
            </p>
          </div>
        )}

        {/* Review Summary (if review provided) */}
        {review && !compactMode && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Resumen de nuestra experiencia
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              {review.tldr}
            </p>
            {review.avgTicket && (
              <p className="text-blue-700 text-sm mt-2">
                <strong>Ticket medio:</strong> ~{review.avgTicket}€ por persona
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className={`
            flex gap-3
            ${compactMode ? 'flex-col' : 'flex-row flex-wrap'}
          `}>
            {venue.phone && (
              <Link
                href={`tel:${venue.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <PhoneIcon className="w-4 h-4" />
                Llamar
              </Link>
            )}
            
            <Link
              href={`https://maps.google.com/?q=${encodeURIComponent(`${venue.address}, ${venue.city.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MapPinIcon className="w-4 h-4" />
              Cómo llegar
            </Link>
            
            {venue.website && (
              <Link
                href={venue.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <GlobeAltIcon className="w-4 h-4" />
                <ExternalLinkIcon className="w-3 h-3" />
                Web
              </Link>
            )}
          </div>
        )}

        {/* Voice Search Optimization Footer */}
        {voiceOptimized && !compactMode && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              🎤 <span>Contenido optimizado para búsqueda por voz</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Helper functions
 */
function getPriceRangeText(priceRange: string): string {
  const ranges = {
    '€': 'Económico',
    '€€': 'Moderado', 
    '€€€': 'Caro',
    '€€€€': 'Muy caro',
  };
  return ranges[priceRange as keyof typeof ranges] || 'Precio variable';
}

function getPriceRangeDescription(priceRange: string): string {
  const descriptions = {
    '€': 'económico (menos de 20€/persona)',
    '€€': 'de precio moderado (20-40€/persona)',
    '€€€': 'de precio alto (40-80€/persona)', 
    '€€€€': 'de alta gama (más de 80€/persona)',
  };
  return descriptions[priceRange as keyof typeof descriptions] || 'de precio variable';
}