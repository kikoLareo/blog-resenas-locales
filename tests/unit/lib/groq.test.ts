import { describe, it, expect } from 'vitest';
import {
  venueFields,
  reviewFields,
  postFields,
  getAllVenues,
  getVenueBySlug,
  getVenuesByCity,
  getVenuesByCategory,
  getAllReviews,
  getReviewBySlug,
  getReviewsByVenue,
  getReviewsByAuthor,
  getAllPosts,
  getPostBySlug,
  getPostsByTag,
  getAllCategories,
  getCategoryBySlug,
  getAllCities,
  getCityBySlug,
  searchVenues,
  searchReviews,
  searchPosts,
  getFeaturedVenues,
  getTopRatedVenues,
  getRecentReviews,
  getRelatedVenues,
  getAllSlugs,
  getLastModified,
  getStats,
  getCityStats,
  validateVenueData,
  validateReviewData,
} from '@/lib/groq';

describe('GROQ Queries', () => {
  // Helper function to validate GROQ syntax
  const validateGroqSyntax = (query: string) => {
    // Basic GROQ syntax validation
    expect(query).toBeTruthy();
    expect(typeof query).toBe('string');
    
    // Should contain GROQ operators
    const hasGroqOperators = /[\*\[\]{}|]/.test(query);
    expect(hasGroqOperators).toBeTruthy();
    
    // Brackets should be balanced
    const brackets = query.match(/[\[\]]/g) || [];
    const openBrackets = brackets.filter(b => b === '[').length;
    const closeBrackets = brackets.filter(b => b === ']').length;
    expect(openBrackets).toBe(closeBrackets);
    
    // Braces should be balanced  
    const braces = query.match(/[{}]/g) || [];
    const openBraces = braces.filter(b => b === '{').length;
    const closeBraces = braces.filter(b => b === '}').length;
    expect(openBraces).toBe(closeBraces);
  };

  describe('Field fragments', () => {
    it('venueFields has valid GROQ syntax', () => {
      validateGroqSyntax(venueFields);
    });

    it('venueFields includes essential venue fields', () => {
      expect(venueFields).toContain('_id');
      expect(venueFields).toContain('title');
      expect(venueFields).toContain('slug');
      expect(venueFields).toContain('description');
      expect(venueFields).toContain('address');
      expect(venueFields).toContain('city');
      expect(venueFields).toContain('geo');
      expect(venueFields).toContain('images');
      expect(venueFields).toContain('social');
      expect(venueFields).toContain('categories');
    });

    it('venueFields includes proper reference resolution', () => {
      expect(venueFields).toContain('city->');
      expect(venueFields).toContain('categories[]->');
      expect(venueFields).toContain('asset->');
    });

    it('reviewFields has valid GROQ syntax', () => {
      validateGroqSyntax(reviewFields);
    });

    it('reviewFields includes essential review fields', () => {
      expect(reviewFields).toContain('_id');
      expect(reviewFields).toContain('title');
      expect(reviewFields).toContain('slug');
      expect(reviewFields).toContain('author');
      expect(reviewFields).toContain('ratings');
      expect(reviewFields).toContain('tldr');
      expect(reviewFields).toContain('venue');
    });

    it('reviewFields includes nested venue data', () => {
      expect(reviewFields).toContain('venue->');
      expect(reviewFields).toContain('${venueFields}');
    });

    it('postFields has valid GROQ syntax', () => {
      validateGroqSyntax(postFields);
    });

    it('postFields includes essential post fields', () => {
      expect(postFields).toContain('_id');
      expect(postFields).toContain('title');
      expect(postFields).toContain('slug');
      expect(postFields).toContain('excerpt');
      expect(postFields).toContain('author');
      expect(postFields).toContain('tags');
      expect(postFields).toContain('cover');
    });
  });

  describe('Basic queries', () => {
    it('getAllVenues has valid syntax and structure', () => {
      validateGroqSyntax(getAllVenues);
      expect(getAllVenues).toContain('*[_type == "venue"]');
      expect(getAllVenues).toContain('order(publishedAt desc)');
      expect(getAllVenues).toContain('${venueFields}');
    });

    it('getVenueBySlug uses parameter and returns single result', () => {
      validateGroqSyntax(getVenueBySlug);
      expect(getVenueBySlug).toContain('*[_type == "venue"');
      expect(getVenueBySlug).toContain('slug.current == $slug');
      expect(getVenueBySlug).toContain('[0]');
    });

    it('getVenuesByCity filters by city slug parameter', () => {
      validateGroqSyntax(getVenuesByCity);
      expect(getVenuesByCity).toContain('city->slug.current == $citySlug');
      expect(getVenuesByCity).toContain('order(publishedAt desc)');
    });

    it('getVenuesByCategory uses array membership check', () => {
      validateGroqSyntax(getVenuesByCategory);
      expect(getVenuesByCategory).toContain('$categorySlug in categories[]->slug.current');
    });

    it('getAllReviews has proper structure', () => {
      validateGroqSyntax(getAllReviews);
      expect(getAllReviews).toContain('*[_type == "review"]');
      expect(getAllReviews).toContain('${reviewFields}');
    });

    it('getReviewBySlug returns single review', () => {
      validateGroqSyntax(getReviewBySlug);
      expect(getReviewBySlug).toContain('[0]');
      expect(getReviewBySlug).toContain('slug.current == $slug');
    });

    it('getReviewsByVenue filters by venue slug', () => {
      validateGroqSyntax(getReviewsByVenue);
      expect(getReviewsByVenue).toContain('venue->slug.current == $venueSlug');
    });

    it('getReviewsByAuthor filters by author name', () => {
      validateGroqSyntax(getReviewsByAuthor);
      expect(getReviewsByAuthor).toContain('author == $author');
    });

    it('getAllPosts has proper structure', () => {
      validateGroqSyntax(getAllPosts);
      expect(getAllPosts).toContain('*[_type == "post"]');
      expect(getAllPosts).toContain('${postFields}');
    });

    it('getPostBySlug returns single post', () => {
      validateGroqSyntax(getPostBySlug);
      expect(getPostBySlug).toContain('[0]');
      expect(getPostBySlug).toContain('slug.current == $slug');
    });

    it('getPostsByTag uses array membership', () => {
      validateGroqSyntax(getPostsByTag);
      expect(getPostsByTag).toContain('$tag in tags');
    });
  });

  describe('Category and city queries', () => {
    it('getAllCategories includes venue count', () => {
      validateGroqSyntax(getAllCategories);
      expect(getAllCategories).toContain('*[_type == "category"]');
      expect(getAllCategories).toContain('count(*[_type == "venue"');
      expect(getAllCategories).toContain('references(^._id)');
      expect(getAllCategories).toContain('order(title asc)');
    });

    it('getCategoryBySlug includes nested venues', () => {
      validateGroqSyntax(getCategoryBySlug);
      expect(getCategoryBySlug).toContain('[0]');
      expect(getCategoryBySlug).toContain('"venues":');
      expect(getCategoryBySlug).toContain('references(^._id)');
    });

    it('getAllCities includes venue count calculation', () => {
      validateGroqSyntax(getAllCities);
      expect(getAllCities).toContain('*[_type == "city"]');
      expect(getAllCities).toContain('count(*[_type == "venue"');
      expect(getAllCities).toContain('city._ref == ^._id');
    });

    it('getCityBySlug includes nested venues', () => {
      validateGroqSyntax(getCityBySlug);
      expect(getCityBySlug).toContain('[0]');
      expect(getCityBySlug).toContain('"venues":');
      expect(getCityBySlug).toContain('city._ref == ^._id');
    });
  });

  describe('Search queries', () => {
    it('searchVenues uses text matching', () => {
      validateGroqSyntax(searchVenues);
      expect(searchVenues).toContain('title match $searchTerm');
      expect(searchVenues).toContain('description match $searchTerm');
      expect(searchVenues).toContain('address match $searchTerm');
      expect(searchVenues).toContain('order(_score desc)');
      expect(searchVenues).toContain('_score');
    });

    it('searchReviews searches relevant fields', () => {
      validateGroqSyntax(searchReviews);
      expect(searchReviews).toContain('title match $searchTerm');
      expect(searchReviews).toContain('tldr match $searchTerm');
      expect(searchReviews).toContain('author match $searchTerm');
      expect(searchReviews).toContain('_score');
    });

    it('searchPosts includes tag search', () => {
      validateGroqSyntax(searchPosts);
      expect(searchPosts).toContain('title match $searchTerm');
      expect(searchPosts).toContain('excerpt match $searchTerm');
      expect(searchPosts).toContain('$searchTerm in tags');
      expect(searchPosts).toContain('_score');
    });
  });

  describe('Advanced queries', () => {
    it('getFeaturedVenues filters by featured flag', () => {
      validateGroqSyntax(getFeaturedVenues);
      expect(getFeaturedVenues).toContain('featured == true');
      expect(getFeaturedVenues).toContain('[0...6]');
    });

    it('getTopRatedVenues calculates average rating', () => {
      validateGroqSyntax(getTopRatedVenues);
      expect(getTopRatedVenues).toContain('math::avg');
      expect(getTopRatedVenues).toContain('"averageRating":');
      expect(getTopRatedVenues).toContain('"reviewCount":');
      expect(getTopRatedVenues).toContain('order(averageRating desc)');
      expect(getTopRatedVenues).toContain('[0...10]');
    });

    it('getRecentReviews uses limit parameter', () => {
      validateGroqSyntax(getRecentReviews);
      expect(getRecentReviews).toContain('[0...$limit]');
      expect(getRecentReviews).toContain('order(publishedAt desc)');
    });

    it('getRelatedVenues excludes current venue', () => {
      validateGroqSyntax(getRelatedVenues);
      expect(getRelatedVenues).toContain('_id != $venueId');
      expect(getRelatedVenues).toContain('city._ref == $cityRef');
      expect(getRelatedVenues).toContain('categories[]._ref[@ in $categoryRefs]');
      expect(getRelatedVenues).toContain('[0...4]');
    });
  });

  describe('Utility queries', () => {
    it('getAllSlugs returns structured slug data', () => {
      validateGroqSyntax(getAllSlugs);
      expect(getAllSlugs).toContain('"venues":');
      expect(getAllSlugs).toContain('"reviews":');
      expect(getAllSlugs).toContain('"posts":');
      expect(getAllSlugs).toContain('"categories":');
      expect(getAllSlugs).toContain('"cities":');
      expect(getAllSlugs).toContain('defined(slug.current)');
    });

    it('getLastModified tracks update times', () => {
      validateGroqSyntax(getLastModified);
      expect(getLastModified).toContain('_updatedAt');
      expect(getLastModified).toContain('order(_updatedAt desc)');
      expect(getLastModified).toContain('[0]._updatedAt');
    });

    it('getStats counts all content types', () => {
      validateGroqSyntax(getStats);
      expect(getStats).toContain('count(*[_type == "venue"])');
      expect(getStats).toContain('count(*[_type == "review"])');
      expect(getStats).toContain('count(*[_type == "post"])');
      expect(getStats).toContain('"totalVenues":');
      expect(getStats).toContain('"totalReviews":');
    });

    it('getCityStats calculates per-city metrics', () => {
      validateGroqSyntax(getCityStats);
      expect(getCityStats).toContain('"venueCount":');
      expect(getCityStats).toContain('"reviewCount":');
      expect(getCityStats).toContain('order(venueCount desc)');
    });
  });

  describe('Validation queries', () => {
    it('validateVenueData checks required fields', () => {
      validateGroqSyntax(validateVenueData);
      expect(validateVenueData).toContain('!defined(title)');
      expect(validateVenueData).toContain('!defined(slug)');
      expect(validateVenueData).toContain('!defined(description)');
      expect(validateVenueData).toContain('!defined(address)');
      expect(validateVenueData).toContain('!defined(city)');
      expect(validateVenueData).toContain('"missingFields":');
    });

    it('validateReviewData checks required fields', () => {
      validateGroqSyntax(validateReviewData);
      expect(validateReviewData).toContain('!defined(title)');
      expect(validateReviewData).toContain('!defined(author)');
      expect(validateReviewData).toContain('!defined(venue)');
      expect(validateReviewData).toContain('!defined(ratings)');
      expect(validateReviewData).toContain('"missingFields":');
    });
  });

  describe('Query parameter validation', () => {
    it('queries with parameters use proper syntax', () => {
      const parameterizedQueries = [
        { name: 'getVenueBySlug', query: getVenueBySlug, param: '$slug' },
        { name: 'getVenuesByCity', query: getVenuesByCity, param: '$citySlug' },
        { name: 'getVenuesByCategory', query: getVenuesByCategory, param: '$categorySlug' },
        { name: 'getReviewBySlug', query: getReviewBySlug, param: '$slug' },
        { name: 'getReviewsByVenue', query: getReviewsByVenue, param: '$venueSlug' },
        { name: 'getReviewsByAuthor', query: getReviewsByAuthor, param: '$author' },
        { name: 'searchVenues', query: searchVenues, param: '$searchTerm' },
      ];

      parameterizedQueries.forEach(({ name, query, param }) => {
        expect(query).toContain(param);
      });
    });

    it('array slice queries use proper syntax', () => {
      expect(getFeaturedVenues).toContain('[0...6]');
      expect(getTopRatedVenues).toContain('[0...10]');
      expect(getRelatedVenues).toContain('[0...4]');
      expect(getRecentReviews).toContain('[0...$limit]');
    });
  });

  describe('Query optimization', () => {
    it('queries use proper ordering for performance', () => {
      const orderedQueries = [
        getAllVenues,
        getVenuesByCity,
        getVenuesByCategory,
        getAllReviews,
        getReviewsByVenue,
        getAllPosts,
        getAllCategories,
        getAllCities,
      ];

      orderedQueries.forEach(query => {
        expect(query).toMatch(/order\([^)]+\)/);
      });
    });

    it('search queries order by relevance score', () => {
      const searchQueries = [searchVenues, searchReviews, searchPosts];
      
      searchQueries.forEach(query => {
        expect(query).toContain('order(_score desc)');
        expect(query).toContain('_score');
      });
    });

    it('single result queries use [0] indexing', () => {
      const singleResultQueries = [
        getVenueBySlug,
        getReviewBySlug,
        getPostBySlug,
        getCategoryBySlug,
        getCityBySlug,
      ];

      singleResultQueries.forEach(query => {
        expect(query).toContain('[0]');
      });
    });
  });

  describe('Reference handling', () => {
    it('queries properly dereference relationships', () => {
      expect(venueFields).toContain('city->');
      expect(venueFields).toContain('categories[]->');
      expect(reviewFields).toContain('venue->');
    });

    it('queries handle asset references correctly', () => {
      expect(venueFields).toContain('asset->{');
      expect(reviewFields).toContain('asset->{');
      expect(postFields).toContain('asset->{');
    });

    it('queries use proper reference syntax for counting', () => {
      expect(getAllCategories).toContain('references(^._id)');
      expect(getCategoryBySlug).toContain('references(^._id)');
      expect(getAllCities).toContain('city._ref == ^._id');
    });
  });

  describe('Field selection', () => {
    it('essential fields are included in all queries', () => {
      const essentialFields = ['_id', 'title', 'slug'];
      const fieldQueries = [venueFields, reviewFields, postFields];

      fieldQueries.forEach(query => {
        essentialFields.forEach(field => {
          expect(query).toContain(field);
        });
      });
    });

    it('computed fields use proper syntax', () => {
      expect(getAllCategories).toContain('"venueCount":');
      expect(getAllCities).toContain('"venueCount":');
      expect(getTopRatedVenues).toContain('"averageRating":');
      expect(getTopRatedVenues).toContain('"reviewCount":');
    });
  });
});

describe('GROQ Query Performance', () => {
  it('queries avoid expensive operations where possible', () => {
    // These queries should not contain nested loops or complex computations
    const performanceCriticalQueries = [
      getAllVenues,
      getAllReviews,
      getAllPosts,
    ];

    performanceCriticalQueries.forEach(query => {
      // Should not contain nested queries without proper indexing
      const nestedQueryCount = (query.match(/\*\[/g) || []).length;
      expect(nestedQueryCount).toBeLessThanOrEqual(2);
    });
  });

  it('search queries are optimized for text search', () => {
    const searchQueries = [searchVenues, searchReviews, searchPosts];
    
    searchQueries.forEach(query => {
      // Should use match operator for text search
      expect(query).toContain('match');
      // Should order by score for relevance
      expect(query).toContain('_score');
    });
  });

  it('aggregation queries use efficient counting', () => {
    expect(getAllCategories).toContain('count(*[');
    expect(getAllCities).toContain('count(*[');
    expect(getStats).toContain('count(*[');
  });
});