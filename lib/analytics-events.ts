/**
 * Eventos de Google Analytics 4 específicos para el nuevo sistema de contenidos SEO
 */

// Tipos de eventos personalizados
interface ContentViewEvent {
  content_type: 'guide' | 'list' | 'recipe' | 'dish-guide' | 'news' | 'offer';
  content_id: string;
  content_title: string;
  city?: string;
  category?: string;
  value?: number;
}

interface ContentInteractionEvent {
  action: 'click' | 'share' | 'bookmark' | 'print' | 'download';
  content_type: string;
  content_id: string;
  element: string;
  value?: number;
}

interface MapInteractionEvent {
  action: 'view_map' | 'filter_map' | 'click_venue' | 'toggle_fullscreen';
  venue_count: number;
  filters_applied?: string[];
  venue_id?: string;
}

interface SearchEvent {
  search_term: string;
  content_type?: string;
  results_count: number;
  city?: string;
}

// Función helper para enviar eventos a GA4
function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag(...args);
  }
}

/**
 * Eventos de visualización de contenido
 */
export const trackContentView = (data: ContentViewEvent) => {
  gtag('event', 'page_view', {
    content_type: data.content_type,
    content_id: data.content_id,
    content_title: data.content_title,
    city: data.city,
    category: data.category,
    custom_parameters: {
      content_type: data.content_type,
      city: data.city,
    }
  });

  // Evento personalizado para contenido SEO
  gtag('event', 'seo_content_view', {
    content_type: data.content_type,
    content_id: data.content_id,
    content_title: data.content_title,
    city: data.city,
    value: data.value || 1,
  });
};

/**
 * Eventos de interacción con contenido
 */
export const trackContentInteraction = (data: ContentInteractionEvent) => {
  gtag('event', data.action, {
    content_type: data.content_type,
    content_id: data.content_id,
    element: data.element,
    value: data.value || 1,
  });

  // Evento específico para compartir
  if (data.action === 'share') {
    gtag('event', 'share', {
      method: 'web_share',
      content_type: data.content_type,
      item_id: data.content_id,
    });
  }
};

/**
 * Eventos de interacción con mapas
 */
export const trackMapInteraction = (data: MapInteractionEvent) => {
  gtag('event', 'map_interaction', {
    action: data.action,
    venue_count: data.venue_count,
    filters_applied: data.filters_applied?.join(',') || '',
    venue_id: data.venue_id,
  });

  // Eventos específicos
  switch (data.action) {
    case 'view_map':
      gtag('event', 'view_item_list', {
        item_list_name: 'map_venues',
        item_list_id: 'interactive_map',
        items: Array.from({ length: data.venue_count }, (_, i) => ({
          item_id: `venue_${i}`,
          item_name: `Venue ${i}`,
          item_category: 'restaurant',
        })),
      });
      break;
    
    case 'click_venue':
      gtag('event', 'select_item', {
        item_list_name: 'map_venues',
        item_list_id: 'interactive_map',
        items: [{
          item_id: data.venue_id,
          item_name: 'Venue',
          item_category: 'restaurant',
        }],
      });
      break;
  }
};

/**
 * Eventos de búsqueda
 */
export const trackSearch = (data: SearchEvent) => {
  gtag('event', 'search', {
    search_term: data.search_term,
    content_type: data.content_type,
    results_count: data.results_count,
    city: data.city,
  });
};

/**
 * Eventos de navegación interna
 */
export const trackInternalNavigation = (data: {
  from_content_type: string;
  from_content_id: string;
  to_content_type: string;
  to_content_id: string;
  link_type: 'related' | 'inline' | 'breadcrumb' | 'menu';
}) => {
  gtag('event', 'internal_navigation', {
    from_content_type: data.from_content_type,
    from_content_id: data.from_content_id,
    to_content_type: data.to_content_type,
    to_content_id: data.to_content_id,
    link_type: data.link_type,
  });
};

/**
 * Eventos de engagement con contenido
 */
export const trackContentEngagement = (data: {
  content_type: string;
  content_id: string;
  engagement_type: 'scroll_depth' | 'time_on_page' | 'recipe_step' | 'faq_expand' | 'section_view';
  value: number;
  additional_data?: Record<string, any>;
}) => {
  gtag('event', 'engagement', {
    content_type: data.content_type,
    content_id: data.content_id,
    engagement_type: data.engagement_type,
    value: data.value,
    ...data.additional_data,
  });
};

/**
 * Eventos de conversión (newsletter, reservas, etc.)
 */
export const trackConversion = (data: {
  conversion_type: 'newsletter_signup' | 'venue_reservation' | 'recipe_save' | 'guide_bookmark';
  content_type?: string;
  content_id?: string;
  value?: number;
}) => {
  gtag('event', 'conversion', {
    currency: 'EUR',
    value: data.value || 1,
    conversion_type: data.conversion_type,
    content_type: data.content_type,
    content_id: data.content_id,
  });

  // Evento específico para newsletter
  if (data.conversion_type === 'newsletter_signup') {
    gtag('event', 'sign_up', {
      method: 'email',
      content_type: data.content_type,
    });
  }
};

/**
 * Eventos de rendimiento de contenido
 */
export const trackContentPerformance = (data: {
  content_type: string;
  content_id: string;
  performance_metric: 'load_time' | 'image_load' | 'map_render' | 'search_response';
  value: number;
}) => {
  gtag('event', 'timing_complete', {
    name: data.performance_metric,
    value: data.value,
    content_type: data.content_type,
    content_id: data.content_id,
  });
};

/**
 * Hook personalizado para tracking automático
 */
export function useAnalytics(contentType: string, contentId: string, contentTitle: string) {
  const trackView = (additionalData?: Partial<ContentViewEvent>) => {
    trackContentView({
      content_type: contentType as any,
      content_id: contentId,
      content_title: contentTitle,
      ...additionalData,
    });
  };

  const trackInteraction = (action: ContentInteractionEvent['action'], element: string) => {
    trackContentInteraction({
      action,
      content_type: contentType,
      content_id: contentId,
      element,
    });
  };

  const trackEngagement = (
    engagement_type: 'scroll_depth' | 'time_on_page' | 'recipe_step' | 'faq_expand' | 'section_view',
    value: number,
    additional_data?: Record<string, any>
  ) => {
    trackContentEngagement({
      content_type: contentType,
      content_id: contentId,
      engagement_type,
      value,
      additional_data,
    });
  };

  return {
    trackView,
    trackInteraction,
    trackEngagement,
  };
}

/**
 * Configuración de eventos automáticos
 */
export function setupAutomaticTracking() {
  if (typeof window === 'undefined') return;

  // Tracking de scroll depth
  let maxScroll = 0;
  const trackScrollDepth = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      gtag('event', 'scroll', {
        scroll_depth: scrollPercent,
      });
    }
  };

  // Tracking de tiempo en página
  const startTime = Date.now();
  const trackTimeOnPage = () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    if (timeOnPage > 0 && timeOnPage % 30 === 0) { // Cada 30 segundos
      gtag('event', 'page_engagement', {
        engagement_time_msec: timeOnPage * 1000,
      });
    }
  };

  // Event listeners
  window.addEventListener('scroll', trackScrollDepth, { passive: true });
  const timeInterval = setInterval(trackTimeOnPage, 30000);

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', trackScrollDepth);
    clearInterval(timeInterval);
  };
}

/**
 * Eventos específicos para cada tipo de contenido
 */
export const contentSpecificEvents = {
  guide: {
    viewMap: (guideId: string, venueCount: number) => 
      trackMapInteraction({ action: 'view_map', venue_count: venueCount }),
    
    filterMap: (guideId: string, filters: string[], venueCount: number) =>
      trackMapInteraction({ action: 'filter_map', venue_count: venueCount, filters_applied: filters }),
    
    clickVenue: (guideId: string, venueId: string) =>
      trackMapInteraction({ action: 'click_venue', venue_count: 1, venue_id: venueId }),
  },

  recipe: {
    startCooking: (recipeId: string) =>
      trackContentInteraction({ action: 'click', content_type: 'recipe', content_id: recipeId, element: 'start_cooking' }),
    
    completeStep: (recipeId: string, stepNumber: number) =>
      trackContentEngagement({ content_type: 'recipe', content_id: recipeId, engagement_type: 'recipe_step', value: stepNumber }),
    
    adjustServings: (recipeId: string, newServings: number) =>
      trackContentInteraction({ action: 'click', content_type: 'recipe', content_id: recipeId, element: 'adjust_servings', value: newServings }),
  },

  list: {
    sortBy: (listId: string, sortMethod: string) =>
      trackContentInteraction({ action: 'click', content_type: 'list', content_id: listId, element: `sort_${sortMethod}` }),
    
    viewComparison: (listId: string) =>
      trackContentInteraction({ action: 'click', content_type: 'list', content_id: listId, element: 'comparison_table' }),
  },

  dishGuide: {
    viewVariation: (guideId: string, variationRegion: string) =>
      trackContentEngagement({ content_type: 'dish-guide', content_id: guideId, engagement_type: 'section_view', value: 1, additional_data: { variation_region: variationRegion } }),
  },
};

// Export default para fácil importación
export default {
  trackContentView,
  trackContentInteraction,
  trackMapInteraction,
  trackSearch,
  trackInternalNavigation,
  trackContentEngagement,
  trackConversion,
  trackContentPerformance,
  useAnalytics,
  setupAutomaticTracking,
  contentSpecificEvents,
};
