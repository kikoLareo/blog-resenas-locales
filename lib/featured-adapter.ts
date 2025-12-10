import { calculateOverallRating } from '@/lib/rating';
import { FeaturedItem, ReviewFeaturedItem, VenueFeaturedItem, CategoryFeaturedItem, CollectionFeaturedItem, GuideFeaturedItem } from '@/components/FeaturedCarousel';
import { slugify } from './slug';

// Tipos para los datos que vienen de Sanity
export type SanityFeaturedItem = {
  _id: string;
  title: string;
  type: 'review' | 'venue' | 'category' | 'collection' | 'guide';
  customTitle?: string;
  customSubtitle?: string;
  customDescription?: string;
  customImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt: string;
  };
  customCTA?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  order: number;
  isActive: boolean;
  publishDate?: string;
  reviewRef?: any;
  venueRef?: any;
  categoryRef?: any;
  customContent?: any;
};

// Función principal para transformar datos de Sanity a formato del componente
export function transformFeaturedItems(sanityItems: SanityFeaturedItem[]): FeaturedItem[] {
  return sanityItems
    .filter(item => item.isActive)
    .map(item => {
      const baseItem = {
        id: item._id,
        type: item.type,
        title: getDisplayTitle(item),
        subtitle: item.customSubtitle,
        description: getDisplayDescription(item),
        image: getDisplayImage(item),
        customImage: item.customImage?.asset?.url,
        href: getItemHref(item),
        ctaText: item.customCTA,
        customTitle: item.customTitle,
        customDescription: item.customDescription,
        isActive: item.isActive,
        order: item.order,
        seoKeywords: item.seoKeywords,
        carouselSeo: {
          title: item.seoTitle,
          description: item.seoDescription,
          keywords: item.seoKeywords,
        },
      };

      // Transformar según el tipo específico
      switch (item.type) {
        case 'review':
          return transformReviewItem(item, baseItem);
        case 'venue':
          return transformVenueItem(item, baseItem);
        case 'category':
          return transformCategoryItem(item, baseItem);
        case 'collection':
          return transformCollectionItem(item, baseItem);
        case 'guide':
          return transformGuideItem(item, baseItem);
        default:
          throw new Error(`Unknown featured item type: ${item.type}`);
      }
    });
}

// Funciones auxiliares para obtener datos de display
function getDisplayTitle(item: SanityFeaturedItem): string {
  if (item.customTitle) return item.customTitle;
  
  switch (item.type) {
    case 'review':
      return item.reviewRef?.title || item.title;
    case 'venue':
      return item.venueRef?.title || item.title;
    case 'category':
      return item.categoryRef?.title || item.title;
    default:
      return item.title;
  }
}

function getDisplayDescription(item: SanityFeaturedItem): string {
  if (item.customDescription) return item.customDescription;
  
  switch (item.type) {
    case 'review':
      return item.reviewRef?.summary || 'Una reseña destacada de nuestro blog';
    case 'venue':
      return item.venueRef?.description || 'Un local destacado en nuestra selección';
    case 'category':
      return item.categoryRef?.description || 'Explora esta categoría gastronómica';
    case 'collection':
    case 'guide':
      return item.customContent?.description || 'Contenido especial seleccionado para ti';
    default:
      return 'Contenido destacado';
  }
}

function getDisplayImage(item: SanityFeaturedItem): string {
  // Si hay imagen personalizada, usarla
  if (item.customImage?.asset?.url) {
    return item.customImage.asset.url;
  }
  
  // Si no, usar la imagen del elemento referenciado
  let imageUrl: string | null = null;
  
  switch (item.type) {
    case 'review':
      imageUrl = item.reviewRef?.image?.asset?.url;
      break;
    case 'venue':
      imageUrl = item.venueRef?.image?.asset?.url;
      break;
    case 'category':
      imageUrl = item.categoryRef?.image?.asset?.url;
      break;
  }
  
  if (imageUrl) {
    return imageUrl;
  }
  
  // Imagen por defecto
  return '/api/placeholder/1920/1080';
}

function getItemHref(item: SanityFeaturedItem): string {
  switch (item.type) {
    case 'review':
      if (item.reviewRef?.slug?.current && item.reviewRef?.venue?.slug?.current) {
        const citySlug = item.reviewRef.venue.city?.slug?.current || 'ciudad';
        return `/${citySlug}/${item.reviewRef.venue.slug.current}/review/${item.reviewRef.slug.current}`;
      }
      return '/blog';
      
    case 'venue':
      if (item.venueRef?.slug?.current) {
        const citySlug = item.venueRef.city?.slug?.current || 'ciudad';
        return `/${citySlug}/${item.venueRef.slug.current}`;
      }
      return '/locales';
      
    case 'category':
      if (item.categoryRef?.slug?.current) {
        return `/categorias/${item.categoryRef.slug.current}`;
      }
      return '/categorias';
      
    case 'collection':
      return `/colecciones/${slugify(item.title)}`;
      
    case 'guide':
      return `/guias/${slugify(item.title)}`;
      
    default:
      return '/';
  }
}

// Transformadores específicos por tipo
function transformReviewItem(item: SanityFeaturedItem, baseItem: any): ReviewFeaturedItem {
  const review = item.reviewRef;
  const avgRating = review?.ratings ? calculateOverallRating(review.ratings) : 5;
  
  return {
    ...baseItem,
    type: 'review',
    rating: Math.round(avgRating * 10) / 10,
    location: review?.venue?.city?.title || 'Ubicación',
    readTime: calculateReadTime(review?.summary || ''),
    tags: review?.tags || [],
    venue: review?.venue ? {
      name: review.venue.title,
      slug: review.venue.slug?.current || '',
    } : undefined,
  };
}

function transformVenueItem(item: SanityFeaturedItem, baseItem: any): VenueFeaturedItem {
  const venue = item.venueRef;
  
  return {
    ...baseItem,
    type: 'venue',
    rating: venue?.averageRating || undefined,
    location: venue?.city?.title || 'Ubicación',
    category: venue?.category?.title || 'Restaurante',
    reviewCount: venue?.reviewCount || 0,
    priceRange: venue?.priceRange || undefined,
    highlights: venue?.highlights || [],
  };
}

function transformCategoryItem(item: SanityFeaturedItem, baseItem: any): CategoryFeaturedItem {
  const category = item.categoryRef;
  
  return {
    ...baseItem,
    type: 'category',
    reviewCount: category?.reviewCount || 0,
    venueCount: category?.venueCount || 0,
    color: category?.color,
    icon: category?.icon,
    trending: category?.reviewCount > 10, // Lógica simple para trending
  };
}

function transformCollectionItem(item: SanityFeaturedItem, baseItem: any): CollectionFeaturedItem {
  const content = item.customContent || {};
  
  return {
    ...baseItem,
    type: 'collection',
    itemCount: content.itemCount || 0,
    lastUpdated: formatRelativeDate(item.publishDate),
    theme: content.theme || 'general',
  };
}

function transformGuideItem(item: SanityFeaturedItem, baseItem: any): GuideFeaturedItem {
  const content = item.customContent || {};
  
  return {
    ...baseItem,
    type: 'guide',
    readTime: content.readTime || '10 min',
    stops: content.stops || 5,
    difficulty: content.difficulty || 'medium',
  };
}

// Funciones utilitarias
function calculateReadTime(text: string): string {
  const wordsPerMinute = 200;
  const wordCount = text.split(' ').length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min`;
}

function formatRelativeDate(dateString?: string): string {
  if (!dateString) return 'recientemente';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'ayer';
  if (diffDays < 7) return `hace ${diffDays} días`;
  if (diffDays < 30) return `hace ${Math.ceil(diffDays / 7)} semanas`;
  return `hace ${Math.ceil(diffDays / 30)} meses`;
}

// Función para validar que un item tiene toda la información necesaria
export function validateFeaturedItem(item: SanityFeaturedItem): boolean {
  // Validaciones básicas
  if (!item.title || !item.type || item.order < 1) {
    return false;
  }
  
  // Validaciones específicas por tipo
  switch (item.type) {
    case 'review':
      return !!item.reviewRef;
    case 'venue':
      return !!item.venueRef;
    case 'category':
      return !!item.categoryRef;
    case 'collection':
    case 'guide':
      return !!item.customContent;
    default:
      return false;
  }
}

// Hook para usar en componentes React
export function useFeaturedItems(sanityItems: SanityFeaturedItem[]) {
  const validItems = sanityItems.filter(validateFeaturedItem);
  const transformedItems = transformFeaturedItems(validItems);
  
  return {
    items: transformedItems,
    totalItems: sanityItems.length,
    activeItems: transformedItems.length,
    hasItems: transformedItems.length > 0,
  };
}
