# Advanced SEO Optimization - Answer Engine Optimization

This document describes the advanced SEO optimizations implemented for Answer Engine Optimization (AEO), voice search, and featured snippets.

## Overview

The advanced SEO optimizations focus on three key areas:
1. **Enhanced Structured Data** - Extended schema types for better search engine understanding
2. **Voice Search Optimization** - Content and markup optimized for voice assistants
3. **Answer Engine Features** - Components designed for featured snippets and "People Also Ask"

## New Components

### 1. EnhancedFAQ Component

**File:** `/components/EnhancedFAQ.tsx`

An enhanced FAQ component with voice search optimization:

- **Voice Search Hints**: Shows examples of voice queries
- **SpeakableSpecification**: Marks content for voice assistants
- **Structured Data**: Enhanced FAQPage schema with voice-friendly markup
- **Conversational Content**: Optimized for natural language queries

```tsx
import EnhancedFAQ from '@/components/EnhancedFAQ';

<EnhancedFAQ
  faqs={faqData}
  title="Preguntas frecuentes"
  context="venue"
  contextData={{ name: "Restaurant Name", cityName: "Madrid" }}
  showVoiceSearchHint={true}
  allowMultipleOpen={true}
/>
```

### 2. PeopleAlsoAsk Component

**File:** `/components/PeopleAlsoAsk.tsx`

Optimized for Google's "People Also Ask" feature:

- **Categorized Questions**: Location, hours, price, booking, general
- **Expandable Answers**: One-at-a-time expansion pattern
- **Voice Search Examples**: Shows voice query patterns
- **Structured Data**: FAQPage schema with proper question/answer markup

```tsx
import PeopleAlsoAsk from '@/components/PeopleAlsoAsk';

<PeopleAlsoAsk
  questions={paaQuestions}
  title="La gente también pregunta"
  showCategories={true}
  maxVisible={6}
/>
```

### 3. InfoSummaryBox Component

**File:** `/components/InfoSummaryBox.tsx`

Summary boxes optimized for featured snippets:

- **Featured Snippet Mode**: Structured content for Google's featured snippets
- **Quick Info Display**: Key information in scannable format
- **Voice-Friendly Content**: Conversational descriptions
- **Action Buttons**: Call, directions, website links

```tsx
import InfoSummaryBox from '@/components/InfoSummaryBox';

<InfoSummaryBox
  venue={venueData}
  review={reviewData}
  variant="featured-snippet"
  voiceOptimized={true}
/>
```

### 4. VenuePageSEO Component

**File:** `/components/seo/VenuePageSEO.tsx`

Complete SEO optimization for venue pages:

- **Enhanced Schemas**: Advanced LocalBusiness and Review schemas
- **Voice Assistant Data**: SpeakableSpecification and voice-optimized content
- **Contextual FAQs**: Dynamic FAQ generation based on venue data
- **PAA Integration**: People Also Ask questions specific to the venue

```tsx
import VenuePageSEO from '@/components/seo/VenuePageSEO';

<VenuePageSEO
  venue={venue}
  review={review}
  recentReviews={recentReviews}
/>
```

## Enhanced Schema Types

### New Schema Types Added

**File:** `/lib/types.ts`

- `SpeakableSpecificationJsonLd` - Voice search optimization
- `MenuJsonLd` - Restaurant menu markup
- `EventJsonLd` - Restaurant events
- `HowToJsonLd` - Step-by-step guides
- `ContactPointJsonLd` - Contact information
- `VideoObjectJsonLd` - Video content
- `ServiceAreaJsonLd` - Service coverage areas

### Enhanced Schema Functions

**File:** `/lib/schema.ts`

- `enhancedLocalBusinessJsonLd()` - Enhanced venue schema with voice search
- `enhancedArticleJsonLd()` - Article schema with speakable content
- `enhancedReviewJsonLd()` - Review schema with voice optimization
- `menuJsonLd()` - Restaurant menu structured data
- `eventJsonLd()` - Event structured data
- `howToJsonLd()` - How-to guide structured data

## Voice Search Optimization

### Voice Search Utilities

**File:** `/lib/voice-search.ts`

Functions for voice search content optimization:

- `generateConversationalDescription()` - Natural language descriptions
- `generateVoiceSearchTitle()` - Voice-friendly titles
- `generatePAAQuestions()` - People Also Ask questions
- `generateLocalSearchKeywords()` - Local search optimization
- `generateConversationalKeywords()` - Long-tail voice queries

### Voice Search Features

1. **Natural Language Content**: Conversational descriptions and answers
2. **Long-tail Keywords**: Question-based keyword optimization  
3. **Local Search Patterns**: "Near me" and location-based queries
4. **Featured Snippet Optimization**: Structured content for snippets
5. **Mobile Voice Optimization**: Quick answers for mobile voice searches

## FAQ Data System

### Contextual FAQ Generation

**File:** `/lib/faq-data.ts`

- **General Restaurant FAQs**: Universal restaurant questions
- **Location-based FAQs**: "Near me" and local search queries
- **Accessibility FAQs**: Special needs and accessibility questions
- **Seasonal FAQs**: Time-based and event questions
- **Comparison FAQs**: Decision-making questions
- **Payment FAQs**: Payment and pricing questions

### Dynamic FAQ Functions

- `getCityFAQs(cityName)` - City-specific questions
- `getCategoryFAQs(categoryName)` - Category-specific questions  
- `getVenueFAQs(venueName, cityName)` - Venue-specific questions
- `getContextualFAQs(context, data)` - Context-aware FAQ selection

## Implementation Examples

### Basic Venue Page Integration

```tsx
import { VenuePageSEO } from '@/components/seo/VenuePageSEO';
import { getContextualFAQs } from '@/lib/faq-data';

export default function VenuePage({ venue, review }) {
  return (
    <div>
      {/* Existing venue content */}
      <VenueHeader venue={venue} />
      <VenueDetails venue={venue} />
      
      {/* Enhanced SEO Components */}
      <VenuePageSEO
        venue={venue}
        review={review}
      />
    </div>
  );
}
```

### City Page Integration

```tsx
import EnhancedFAQ from '@/components/EnhancedFAQ';
import { getContextualFAQs } from '@/lib/faq-data';

export default function CityPage({ city, venues }) {
  const cityFAQs = getContextualFAQs('city', { name: city.title });
  
  return (
    <div>
      {/* Existing city content */}
      
      <EnhancedFAQ
        faqs={cityFAQs}
        title={`Preguntas sobre restaurantes en ${city.title}`}
        context="city"
        contextData={{ name: city.title }}
      />
    </div>
  );
}
```

### Custom FAQ Integration

```tsx
import EnhancedFAQ from '@/components/EnhancedFAQ';
import PeopleAlsoAsk from '@/components/PeopleAlsoAsk';

const customFAQs = [
  {
    question: '¿Cuál es el mejor restaurante italiano en Madrid?',
    answer: 'Los mejores restaurantes italianos en Madrid incluyen...',
  },
  // More FAQs
];

const paaQuestions = [
  {
    question: '¿Está abierto el restaurante ahora?',
    answer: 'Los horarios del restaurante son...',
    category: 'hours',
  },
  // More PAA questions
];

<div>
  <EnhancedFAQ faqs={customFAQs} />
  <PeopleAlsoAsk questions={paaQuestions} />
</div>
```

## Voice Search Optimization Tips

### Content Optimization

1. **Use Natural Language**: Write content as people speak
2. **Answer Questions Directly**: Provide clear, concise answers
3. **Include Location Information**: Optimize for "near me" searches
4. **Use Conversational Tone**: Match how people ask questions
5. **Provide Quick Answers**: First paragraph should answer the main question

### Technical Optimization

1. **SpeakableSpecification**: Mark important content for voice reading
2. **Structured Data**: Use enhanced schemas for better understanding
3. **Fast Loading**: Voice search favors fast-loading pages
4. **Mobile Optimization**: Most voice searches are mobile
5. **Local SEO**: Optimize for local voice searches

## Testing and Validation

### Structured Data Testing

Use Google's Rich Results Test:
```
https://search.google.com/test/rich-results
```

### Voice Search Testing

Test voice queries with:
- Google Assistant: "Hey Google, [query]"
- Siri: "Hey Siri, [query]"  
- Alexa: "Alexa, [query]"

### FAQ Testing

Common voice search patterns to test:
- "¿Cuál es el mejor restaurante en [city]?"
- "¿Está abierto [restaurant] ahora?"
- "¿Cómo llego a [restaurant]?"
- "¿Necesito reserva para [restaurant]?"

## Performance Impact

### Bundle Size Impact

The new components add approximately:
- EnhancedFAQ: ~8KB gzipped
- PeopleAlsoAsk: ~6KB gzipped  
- InfoSummaryBox: ~7KB gzipped
- Voice Search Utils: ~5KB gzipped

### Runtime Performance

- Components use React best practices (memo, lazy loading)
- Structured data is generated server-side when possible
- Voice search data is cached and reused

## Browser Support

### Voice Search Features
- Chrome: Full support
- Firefox: Partial support
- Safari: Partial support
- Edge: Full support

### Structured Data
- All modern browsers support JSON-LD
- Progressive enhancement for unsupported features

## Troubleshooting

### Common Issues

1. **Structured Data Errors**: Validate with Google's testing tool
2. **Voice Search Not Working**: Check SpeakableSpecification markup
3. **FAQ Not Expanding**: Check JavaScript console for errors
4. **Missing Schemas**: Verify data props are passed correctly

### Debug Mode

Enable debug mode in development:
```tsx
<VenuePageSEO venue={venue} />
```

This shows structured data in an expandable debug panel.

## Future Enhancements

### Planned Features

1. **AI-Generated FAQs**: Dynamic FAQ generation based on content
2. **Voice Search Analytics**: Track voice search performance
3. **A/B Testing**: Test different voice search optimizations
4. **Multi-language Support**: Voice search in multiple languages
5. **Advanced Schemas**: Additional schema types as needed

### Performance Optimizations

1. **Code Splitting**: Lazy load SEO components
2. **Caching**: Cache generated schemas and FAQ data
3. **Compression**: Further optimize component bundle sizes
4. **CDN Integration**: Serve SEO assets from CDN