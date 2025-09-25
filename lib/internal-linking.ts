/**
 * Sistema de enlazado interno automático entre contenidos
 * Implementa las reglas de enlazado definidas en la arquitectura SEO
 */

import { sanityFetch } from './sanity.client';

// Tipos para el sistema de enlazado
interface ContentItem {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  city?: { title: string; slug: { current: string } };
  categories?: Array<{ title: string; slug: { current: string } }>;
  tags?: string[];
  dishName?: string;
  dish?: string;
  neighborhood?: string;
  publishedAt: string;
}

interface LinkSuggestion {
  type: 'guide' | 'list' | 'recipe' | 'dish-guide' | 'venue' | 'review';
  title: string;
  url: string;
  relevanceScore: number;
  reason: string;
}

// Queries para obtener contenido relacionado
const relatedContentQueries = {
  guides: `*[_type == "guide" && published == true] {
    _id, _type, title, slug, city->{title, slug}, neighborhood, theme, publishedAt
  }`,
  
  lists: `*[_type == "list" && published == true] {
    _id, _type, title, slug, city->{title, slug}, dish, listType, publishedAt
  }`,
  
  recipes: `*[_type == "recipe" && published == true] {
    _id, _type, title, slug, dishName: title, publishedAt
  }`,
  
  dishGuides: `*[_type == "dish-guide" && published == true] {
    _id, _type, title, slug, dishName, publishedAt
  }`,
  
  venues: `*[_type == "venue"] {
    _id, _type, title, slug, city->{title, slug}, 
    categories[]->{title, slug}, address, publishedAt: _createdAt
  }`,
  
  reviews: `*[_type == "review" && published == true] {
    _id, _type, title, slug, venue->{city->{title, slug}}, 
    tags, publishedAt
  }`
};

/**
 * Obtiene sugerencias de enlaces internos para un contenido específico
 */
export async function getInternalLinkSuggestions(
  contentType: string,
  contentId: string,
  contentData: any
): Promise<LinkSuggestion[]> {
  const suggestions: LinkSuggestion[] = [];

  try {
    // Obtener todo el contenido relacionado
    const [guides, lists, recipes, dishGuides, venues, reviews] = await Promise.all([
      sanityFetch({ query: relatedContentQueries.guides, revalidate: 3600 }),
      sanityFetch({ query: relatedContentQueries.lists, revalidate: 3600 }),
      sanityFetch({ query: relatedContentQueries.recipes, revalidate: 3600 }),
      sanityFetch({ query: relatedContentQueries.dishGuides, revalidate: 3600 }),
      sanityFetch({ query: relatedContentQueries.venues, revalidate: 3600 }),
      sanityFetch({ query: relatedContentQueries.reviews, revalidate: 3600 }),
    ]);

    // Aplicar reglas de enlazado según el tipo de contenido
    switch (contentType) {
      case 'guide':
        suggestions.push(...getGuideLinks(contentData, { lists, venues, dishGuides }));
        break;
      
      case 'list':
        suggestions.push(...getListLinks(contentData, { guides, venues, dishGuides, recipes }));
        break;
      
      case 'recipe':
        suggestions.push(...getRecipeLinks(contentData, { dishGuides, lists, venues }));
        break;
      
      case 'dish-guide':
        suggestions.push(...getDishGuideLinks(contentData, { recipes, lists, venues }));
        break;
      
      case 'venue':
        suggestions.push(...getVenueLinks(contentData, { guides, lists, reviews }));
        break;
      
      case 'review':
        suggestions.push(...getReviewLinks(contentData, { guides, lists, venues }));
        break;
    }

    // Ordenar por relevancia y limitar resultados
    return suggestions
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 8);

  } catch (error) {
    console.error('Error getting internal link suggestions:', error);
    return [];
  }
}

/**
 * Enlaces para Guías: Guías → Listas → Fichas
 */
function getGuideLinks(guide: any, content: any): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];
  const citySlug = guide.city?.slug?.current;

  // 1. Listas relacionadas por ciudad y tema
  content.lists.forEach((list: any) => {
    if (list.city?.slug?.current === citySlug && list._id !== guide._id) {
      let score = 70;
      let reason = `Lista en ${guide.city?.title}`;
      
      // Bonus si comparten tema/barrio
      if (guide.neighborhood && list.title.toLowerCase().includes(guide.neighborhood.toLowerCase())) {
        score += 20;
        reason += ` (mismo barrio: ${guide.neighborhood})`;
      }
      
      if (guide.theme && list.dish && list.dish.toLowerCase().includes(guide.theme.toLowerCase())) {
        score += 15;
        reason += ` (tema relacionado)`;
      }

      suggestions.push({
        type: 'list',
        title: list.title,
        url: `/${citySlug}/rankings/${list.slug.current}`,
        relevanceScore: score,
        reason
      });
    }
  });

  // 2. Guías de platos si hay platos mencionados
  if (guide.sections) {
    content.dishGuides.forEach((dishGuide: any) => {
      let score = 50;
      suggestions.push({
        type: 'dish-guide',
        title: dishGuide.title,
        url: `/platos/${dishGuide.slug.current}`,
        relevanceScore: score,
        reason: 'Guía de plato relacionada'
      });
    });
  }

  // 3. Locales destacados (si están en las secciones)
  if (guide.sections) {
    const venueIds = guide.sections.flatMap((section: any) => 
      section.venues?.map((v: any) => v.venue?._id) || []
    ).filter(Boolean);

    content.venues.forEach((venue: any) => {
      if (venueIds.includes(venue._id)) {
        suggestions.push({
          type: 'venue',
          title: venue.title,
          url: `/${citySlug}/${venue.slug.current}`,
          relevanceScore: 60,
          reason: 'Local incluido en la guía'
        });
      }
    });
  }

  return suggestions;
}

/**
 * Enlaces para Listas: Listas → Fichas → Guías
 */
function getListLinks(list: any, content: any): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];
  const citySlug = list.city?.slug?.current;

  // 1. Guías de la misma ciudad
  content.guides.forEach((guide: any) => {
    if (guide.city?.slug?.current === citySlug && guide._id !== list._id) {
      let score = 75;
      let reason = `Guía en ${list.city?.title}`;
      
      // Bonus por barrio
      if (list.neighborhood && guide.neighborhood === list.neighborhood) {
        score += 20;
        reason += ` (mismo barrio)`;
      }

      suggestions.push({
        type: 'guide',
        title: guide.title,
        url: `/${citySlug}/guias/${guide.slug.current}`,
        relevanceScore: score,
        reason
      });
    }
  });

  // 2. Guía de plato si es un ranking por plato específico
  if (list.dish) {
    content.dishGuides.forEach((dishGuide: any) => {
      if (dishGuide.dishName.toLowerCase().includes(list.dish.toLowerCase())) {
        suggestions.push({
          type: 'dish-guide',
          title: dishGuide.title,
          url: `/platos/${dishGuide.slug.current}`,
          relevanceScore: 90,
          reason: `Guía específica de ${list.dish}`
        });
      }
    });
  }

  // 3. Recetas relacionadas
  if (list.dish) {
    content.recipes.forEach((recipe: any) => {
      if (recipe.title.toLowerCase().includes(list.dish.toLowerCase())) {
        suggestions.push({
          type: 'recipe',
          title: recipe.title,
          url: `/recetas/${recipe.slug.current}`,
          relevanceScore: 70,
          reason: `Receta de ${list.dish}`
        });
      }
    });
  }

  return suggestions;
}

/**
 * Enlaces para Recetas: Recetas → Guías de Plato → Listas → Fichas
 */
function getRecipeLinks(recipe: any, content: any): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];
  const dishName = recipe.dishName || recipe.title;

  // 1. Guía de plato específica
  content.dishGuides.forEach((dishGuide: any) => {
    if (dishGuide.dishName.toLowerCase().includes(dishName.toLowerCase()) ||
        dishName.toLowerCase().includes(dishGuide.dishName.toLowerCase())) {
      suggestions.push({
        type: 'dish-guide',
        title: dishGuide.title,
        url: `/platos/${dishGuide.slug.current}`,
        relevanceScore: 95,
        reason: `Guía completa de ${dishGuide.dishName}`
      });
    }
  });

  // 2. Listas donde probar el plato
  content.lists.forEach((list: any) => {
    if (list.dish && (
      list.dish.toLowerCase().includes(dishName.toLowerCase()) ||
      dishName.toLowerCase().includes(list.dish.toLowerCase())
    )) {
      const citySlug = list.city?.slug?.current;
      suggestions.push({
        type: 'list',
        title: list.title,
        url: `/${citySlug}/rankings/${list.slug.current}`,
        relevanceScore: 85,
        reason: `Dónde probar ${list.dish} en ${list.city?.title}`
      });
    }
  });

  // 3. Locales relacionados (si están en relatedVenues)
  if (recipe.relatedVenues) {
    recipe.relatedVenues.forEach((venue: any) => {
      const citySlug = venue.city?.slug?.current;
      suggestions.push({
        type: 'venue',
        title: venue.title,
        url: `/${citySlug}/${venue.slug.current}`,
        relevanceScore: 80,
        reason: 'Local recomendado para probar el plato'
      });
    });
  }

  return suggestions;
}

/**
 * Enlaces para Guías de Plato: Guías → Recetas → Listas
 */
function getDishGuideLinks(dishGuide: any, content: any): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];
  const dishName = dishGuide.dishName;

  // 1. Recetas del plato
  content.recipes.forEach((recipe: any) => {
    if (recipe.title.toLowerCase().includes(dishName.toLowerCase()) ||
        dishName.toLowerCase().includes(recipe.title.toLowerCase())) {
      suggestions.push({
        type: 'recipe',
        title: recipe.title,
        url: `/recetas/${recipe.slug.current}`,
        relevanceScore: 90,
        reason: `Receta casera de ${dishName}`
      });
    }
  });

  // 2. Listas donde probarlo
  content.lists.forEach((list: any) => {
    if (list.dish && (
      list.dish.toLowerCase().includes(dishName.toLowerCase()) ||
      dishName.toLowerCase().includes(list.dish.toLowerCase())
    )) {
      const citySlug = list.city?.slug?.current;
      suggestions.push({
        type: 'list',
        title: list.title,
        url: `/${citySlug}/rankings/${list.slug.current}`,
        relevanceScore: 85,
        reason: `Mejores sitios para ${dishName}`
      });
    }
  });

  // 3. Locales específicos (de bestVenues)
  if (dishGuide.bestVenues) {
    dishGuide.bestVenues.slice(0, 3).forEach((venueItem: any) => {
      suggestions.push({
        type: 'venue',
        title: venueItem.venue.title,
        url: `/locales/${venueItem.venue.slug.current}`,
        relevanceScore: 75,
        reason: `#${venueItem.position} mejor sitio para ${dishName}`
      });
    });
  }

  return suggestions;
}

/**
 * Enlaces para Locales: Fichas → Guías → Listas
 */
function getVenueLinks(venue: any, content: any): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];
  const citySlug = venue.city?.slug?.current;

  // 1. Guías que incluyan este local
  content.guides.forEach((guide: any) => {
    if (guide.city?.slug?.current === citySlug) {
      suggestions.push({
        type: 'guide',
        title: guide.title,
        url: `/${citySlug}/guias/${guide.slug.current}`,
        relevanceScore: 80,
        reason: `Guía gastronómica de ${guide.city?.title}`
      });
    }
  });

  // 2. Listas por categoría
  if (venue.categories) {
    venue.categories.forEach((category: any) => {
      content.lists.forEach((list: any) => {
        if (list.city?.slug?.current === citySlug && 
            list.title.toLowerCase().includes(category.title.toLowerCase())) {
          suggestions.push({
            type: 'list',
            title: list.title,
            url: `/${citySlug}/rankings/${list.slug.current}`,
            relevanceScore: 75,
            reason: `Ranking de ${category.title}`
          });
        }
      });
    });
  }

  return suggestions;
}

/**
 * Enlaces para Reseñas: Reseñas → Guías → Listas → Fichas
 */
function getReviewLinks(review: any, content: any): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];
  const citySlug = review.venue?.city?.slug?.current;

  // 1. Guías de la ciudad
  content.guides.forEach((guide: any) => {
    if (guide.city?.slug?.current === citySlug) {
      suggestions.push({
        type: 'guide',
        title: guide.title,
        url: `/${citySlug}/guias/${guide.slug.current}`,
        relevanceScore: 70,
        reason: `Más opciones en ${guide.city?.title}`
      });
    }
  });

  // 2. Listas relacionadas por tags
  if (review.tags) {
    content.lists.forEach((list: any) => {
      if (list.city?.slug?.current === citySlug) {
        const commonTags = review.tags.filter((tag: string) => 
          list.title.toLowerCase().includes(tag.toLowerCase())
        );
        
        if (commonTags.length > 0) {
          suggestions.push({
            type: 'list',
            title: list.title,
            url: `/${citySlug}/rankings/${list.slug.current}`,
            relevanceScore: 65,
            reason: `Rankings similares`
          });
        }
      }
    });
  }

  return suggestions;
}

/**
 * Genera módulos de "También te puede interesar" para insertar en templates
 */
export function generateRelatedContentModule(suggestions: LinkSuggestion[]): {
  guides: LinkSuggestion[];
  lists: LinkSuggestion[];
  recipes: LinkSuggestion[];
  venues: LinkSuggestion[];
} {
  return {
    guides: suggestions.filter(s => s.type === 'guide').slice(0, 3),
    lists: suggestions.filter(s => s.type === 'list').slice(0, 3),
    recipes: suggestions.filter(s => s.type === 'recipe').slice(0, 2),
    venues: suggestions.filter(s => s.type === 'venue').slice(0, 4),
  };
}

/**
 * Hook para usar en componentes React
 */
export function useInternalLinking(contentType: string, contentId: string, contentData: any) {
  // En un hook real, usarías useState y useEffect
  // Por ahora retornamos una función para obtener las sugerencias
  return {
    getSuggestions: () => getInternalLinkSuggestions(contentType, contentId, contentData),
    generateModule: (suggestions: LinkSuggestion[]) => generateRelatedContentModule(suggestions)
  };
}
