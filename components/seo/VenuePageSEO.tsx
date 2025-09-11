'use client';

import { Venue, Review } from '@/lib/types';
import EnhancedFAQ from '@/components/EnhancedFAQ';
import PeopleAlsoAsk from '@/components/PeopleAlsoAsk';
import InfoSummaryBox from '@/components/InfoSummaryBox';
import { getContextualFAQs } from '@/lib/faq-data';
import { generatePAAQuestions, generateVoiceAssistantData } from '@/lib/voice-search';
import { 
  enhancedLocalBusinessJsonLd, 
  enhancedReviewJsonLd, 
  renderJsonLd 
} from '@/lib/schema';

interface VenuePageSEOProps {
  venue: Venue;
  review?: Review;
  recentReviews?: Review[];
  className?: string;
}

/**
 * Complete SEO optimization component for venue pages
 * Includes enhanced schemas, voice search optimization, and Answer Engine features
 */
export default function VenuePageSEO({ 
  venue, 
  review, 
  recentReviews = [],
  className = '' 
}: VenuePageSEOProps) {
  
  // Generate contextual FAQs for the venue
  const venueFAQs = getContextualFAQs('venue', {
    name: venue.title,
    cityName: venue.city.title,
  });

  // Generate People Also Ask questions
  const paaQuestions = generatePAAQuestions(venue).map(q => ({
    ...q,
    category: getQuestionCategory(q.question) as any,
  }));

  // Generate voice assistant data
  const voiceData = generateVoiceAssistantData(venue);

  // Generate enhanced schemas
  const enhancedVenueSchema = enhancedLocalBusinessJsonLd(venue);
  const reviewSchema = review ? enhancedReviewJsonLd(review, venue) : null;

  return (
    <div className={`venue-page-seo ${className}`}>
      {/* Enhanced Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: renderJsonLd(enhancedVenueSchema) || '' 
        }}
      />
      
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: renderJsonLd(reviewSchema) || '' 
          }}
        />
      )}

      {/* Voice Assistant Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SpeakableSpecification',
            xpath: [
              '/html/head/title',
              '/html/body//h1',
              '/html/body//*[@class="venue-summary"]',
              '/html/body//*[@class="review-tldr"]',
            ],
            cssSelector: [
              'h1',
              '.venue-summary',
              '.review-tldr', 
              '.info-summary-box',
              '.people-also-ask',
            ],
          }),
        }}
      />

      {/* Info Summary Box - Featured Snippet Optimized */}
      <section className="mb-8">
        <InfoSummaryBox
          venue={venue}
          review={review}
          variant="featured-snippet"
          voiceOptimized={true}
          className="venue-summary"
        />
      </section>

      {/* People Also Ask Section */}
      <section className="mb-8">
        <PeopleAlsoAsk
          questions={paaQuestions}
          title="Preguntas frecuentes sobre este restaurante"
          showCategories={true}
          maxVisible={6}
        />
      </section>

      {/* Enhanced FAQ Section */}
      <section className="mb-8">
        <EnhancedFAQ
          faqs={venueFAQs}
          title={`Preguntas sobre ${venue.title}`}
          context="venue"
          contextData={{
            name: venue.title,
            cityName: venue.city.title,
          }}
          showVoiceSearchHint={true}
          allowMultipleOpen={true}
        />
      </section>

      {/* Voice Search Optimization Tips */}
      <section className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
        <div className="text-center">
          <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center justify-center gap-2">
            🎙️ Búsqueda por Voz Optimizada
          </h3>
          <p className="text-green-800 mb-4 max-w-2xl mx-auto">
            Esta página está optimizada para búsquedas por voz. Puedes preguntar directamente:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {voiceData.voiceQuestions.slice(0, 4).map((q, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900 mb-1">
                  &ldquo;{q.question}&rdquo;
                </div>
                <div className="text-xs text-green-700">
                  {q.answer.slice(0, 80)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Data Summary for Debugging (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 p-4 bg-gray-100 rounded-lg">
          <summary className="font-semibold text-gray-900 cursor-pointer">
            🔍 Datos Estructurados (Desarrollo)
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Enhanced LocalBusiness Schema:</h4>
              <pre className="text-xs bg-white p-2 rounded overflow-auto mt-2">
                {JSON.stringify(enhancedVenueSchema, null, 2)}
              </pre>
            </div>
            {reviewSchema && (
              <div>
                <h4 className="font-medium text-gray-900">Enhanced Review Schema:</h4>
                <pre className="text-xs bg-white p-2 rounded overflow-auto mt-2">
                  {JSON.stringify(reviewSchema, null, 2)}
                </pre>
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-900">Voice Assistant Data:</h4>
              <pre className="text-xs bg-white p-2 rounded overflow-auto mt-2">
                {JSON.stringify(voiceData, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}

/**
 * Helper function to categorize PAA questions
 */
function getQuestionCategory(question: string): string {
  if (question.includes('abierto') || question.includes('horario')) return 'hours';
  if (question.includes('reserva') || question.includes('llamar')) return 'booking';
  if (question.includes('cuesta') || question.includes('precio')) return 'price';
  if (question.includes('llegar') || question.includes('dirección')) return 'location';
  return 'general';
}

/**
 * Compact version for sidebars or smaller spaces
 */
export function CompactVenuePageSEO({
  venue,
  className = '',
}: {
  venue: Venue;
  className?: string;
}) {
  const paaQuestions = generatePAAQuestions(venue).slice(0, 3);
  const venueFAQs = getContextualFAQs('venue', {
    name: venue.title,
    cityName: venue.city.title,
  }).slice(0, 3);

  return (
    <div className={`compact-venue-seo ${className}`}>
      {/* Compact Info Summary */}
      <InfoSummaryBox
        venue={venue}
        variant="compact"
        showActions={false}
        className="mb-4"
      />

      {/* Compact PAA */}
      <PeopleAlsoAsk
        questions={paaQuestions}
        title="Preguntas frecuentes"
        maxVisible={3}
        className="mb-4"
      />

      {/* Compact FAQ */}
      <EnhancedFAQ
        faqs={venueFAQs}
        title="FAQ"
        showVoiceSearchHint={false}
        allowMultipleOpen={false}
        className="compact-faq"
      />
    </div>
  );
}