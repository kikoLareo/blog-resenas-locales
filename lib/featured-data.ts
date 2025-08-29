import { client } from '@/lib/sanity.client';
import { getFeaturedItems } from '@/lib/featured-queries';
import { transformFeaturedItems, SanityFeaturedItem } from '@/lib/featured-adapter';
import { FeaturedItem } from '@/components/FeaturedCarousel';

// Datos de fallback en caso de que no haya elementos configurados en Sanity
const fallbackFeaturedItems: FeaturedItem[] = [
  {
    id: "fallback-1",
    type: "review",
    title: "El mejor marisco de la ciudad",
    description: "Una experiencia gastronómica única en el corazón de A Coruña. Mariscos frescos y un ambiente acogedor que te transportará a las mejores tradiciones gallegas.",
    image: "https://images.unsplash.com/photo-1559847844-d678f809758b?w=1920&h=1080&fit=crop",
    href: "/blog/mejor-marisco-coruna",
    rating: 4.8,
    location: "Centro, A Coruña",
    readTime: "5 min",
    tags: ["Marisco", "Tradicional", "Familiar"],
    isActive: true,
    order: 1,
  } as FeaturedItem,
  {
    id: "fallback-2", 
    type: "venue",
    title: "Restaurante O Parrote",
    description: "Cocina gallega tradicional con toques modernos. Un lugar donde la tradición y la innovación se encuentran para crear platos únicos.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop",
    href: "/a-coruna/restaurante-o-parrote",
    rating: 4.6,
    location: "Ciudad Vieja, A Coruña",
    category: "Gallego Tradicional",
    reviewCount: 127,
    priceRange: "$$",
    isActive: true,
    order: 2,
  } as FeaturedItem,
  {
    id: "fallback-3",
    type: "category", 
    title: "Tapas y Pinchos",
    description: "Descubre la mejor selección de tapas y pinchos de A Coruña. Desde los clásicos hasta las propuestas más innovadoras.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&h=1080&fit=crop",
    href: "/categorias/tapas-pinchos",
    reviewCount: 89,
    venueCount: 34,
    trending: true,
    isActive: true,
    order: 3,
  } as FeaturedItem,
];

// Función para obtener elementos destacados desde Sanity
export async function getFeaturedItemsData(): Promise<{
  items: FeaturedItem[];
  fallbackItems: FeaturedItem[];
  hasCustomItems: boolean;
}> {
  try {
    // Intentar obtener datos de Sanity
    const sanityItems: SanityFeaturedItem[] = await client.fetch(getFeaturedItems);
    
    if (sanityItems && sanityItems.length > 0) {
      const transformedItems = transformFeaturedItems(sanityItems);
      
      return {
        items: transformedItems,
        fallbackItems: fallbackFeaturedItems,
        hasCustomItems: true,
      };
    }
    
    // Si no hay items en Sanity, usar fallback
    return {
      items: fallbackFeaturedItems,
      fallbackItems: fallbackFeaturedItems,
      hasCustomItems: false,
    };
    
  } catch (error) {
    console.error('Error fetching featured items from Sanity:', error);
    
    // En caso de error, usar fallback
    return {
      items: fallbackFeaturedItems,
      fallbackItems: fallbackFeaturedItems,
      hasCustomItems: false,
    };
  }
}

// Función para pre-cargar los elementos destacados en build time
export async function getStaticFeaturedItems(): Promise<FeaturedItem[]> {
  try {
    const { items } = await getFeaturedItemsData();
    return items;
  } catch (error) {
    console.error('Error in getStaticFeaturedItems:', error);
    return fallbackFeaturedItems;
  }
}

// Hook para usar en componentes del lado del cliente
export function useFallbackFeaturedItems(): FeaturedItem[] {
  return fallbackFeaturedItems;
}

// Función para generar metadata SEO basada en los elementos destacados
export function generateFeaturedItemsMetadata(items: FeaturedItem[]) {
  const firstItem = items[0];
  if (!firstItem) return {};

  const title = firstItem.carouselSeo?.title || firstItem.title;
  const description = firstItem.carouselSeo?.description || firstItem.description;
  const keywords = firstItem.carouselSeo?.keywords || firstItem.seoKeywords || [];

  return {
    title: `${title} | Blog de Reseñas A Coruña`,
    description: description,
    keywords: keywords.join(', '),
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: firstItem.image,
          width: 1920,
          height: 1080,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [firstItem.image],
    },
  };
}

// Utilidades para el admin
export function validateFeaturedItemData(item: Partial<SanityFeaturedItem>): string[] {
  const errors: string[] = [];

  if (!item.title?.trim()) {
    errors.push('El título es obligatorio');
  }

  if (!item.type) {
    errors.push('El tipo de elemento es obligatorio');
  }

  if (typeof item.order !== 'number' || item.order < 1) {
    errors.push('El orden debe ser un número mayor a 0');
  }

  // Validaciones específicas por tipo
  switch (item.type) {
    case 'review':
      if (!item.reviewRef) {
        errors.push('Debe seleccionar una reseña');
      }
      break;
    case 'venue':
      if (!item.venueRef) {
        errors.push('Debe seleccionar un local');
      }
      break;
    case 'category':
      if (!item.categoryRef) {
        errors.push('Debe seleccionar una categoría');
      }
      break;
    case 'collection':
    case 'guide':
      if (!item.customContent) {
        errors.push('Debe configurar el contenido personalizado');
      }
      break;
  }

  return errors;
}

// Función para generar sugerencias de IA (placeholder para futura implementación)
export async function generateAISuggestions(item: Partial<SanityFeaturedItem>): Promise<{
  titleSuggestions: string[];
  descriptionSuggestions: string[];
  keywordSuggestions: string[];
  optimizationScore: number;
}> {
  // TODO: Implementar integración con OpenAI o similar
  // Por ahora retornamos sugerencias básicas
  
  const baseSuggestions = {
    titleSuggestions: [
      item.title ? `${item.title} - Imprescindible en A Coruña` : '',
      item.title ? `Descubre ${item.title}` : '',
      item.title ? `Lo mejor de ${item.title}` : '',
    ].filter(Boolean),
    
    descriptionSuggestions: [
      'Una experiencia gastronómica única que no puedes perderte en A Coruña',
      'Descubre por qué este lugar se ha convertido en uno de los favoritos locales',
      'La perfecta combinación de tradición y modernidad en el corazón de la ciudad',
    ],
    
    keywordSuggestions: [
      'A Coruña',
      'restaurante',
      'gastronomía gallega',
      'mejor comida',
      'reseñas gastronómicas',
    ],
    
    optimizationScore: Math.floor(Math.random() * 40) + 60, // Score entre 60-100
  };

  return baseSuggestions;
}
