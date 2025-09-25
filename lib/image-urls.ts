/**
 * Configuración centralizada de URLs de imágenes
 * Usa URLs de Unsplash más estables o placeholders como fallback
 */

// Usar Picsum Photos como alternativa más confiable a Unsplash
const PICSUM_BASE = 'https://picsum.photos';

// URLs de imágenes gastronómicas usando Picsum (más estables)
export const FOOD_IMAGES = {
  // Restaurantes y comida general
  restaurant: `${PICSUM_BASE}/800/600?random=1`,
  dining: `${PICSUM_BASE}/800/600?random=2`,
  kitchen: `${PICSUM_BASE}/800/600?random=3`,
  chef: `${PICSUM_BASE}/800/600?random=4`,
  
  // Tipos de comida específicos
  pizza: `${PICSUM_BASE}/800/600?random=5`,
  pasta: `${PICSUM_BASE}/800/600?random=6`,
  sushi: `${PICSUM_BASE}/800/600?random=7`,
  tapas: `${PICSUM_BASE}/800/600?random=8`,
  paella: `${PICSUM_BASE}/800/600?random=9`,
  seafood: `${PICSUM_BASE}/800/600?random=10`,
  meat: `${PICSUM_BASE}/800/600?random=11`,
  dessert: `${PICSUM_BASE}/800/600?random=12`,
  coffee: `${PICSUM_BASE}/800/600?random=13`,
  wine: `${PICSUM_BASE}/800/600?random=14`,
  
  // Ciudades españolas
  madrid: `${PICSUM_BASE}/1200/800?random=15`,
  barcelona: `${PICSUM_BASE}/1200/800?random=16`,
  valencia: `${PICSUM_BASE}/1200/800?random=17`,
  sevilla: `${PICSUM_BASE}/1200/800?random=18`,
  bilbao: `${PICSUM_BASE}/1200/800?random=19`,
  
  // Categorías gastronómicas
  traditional: `${PICSUM_BASE}/800/600?random=20`,
  international: `${PICSUM_BASE}/800/600?random=21`,
  fineDining: `${PICSUM_BASE}/800/600?random=22`,
  brunch: `${PICSUM_BASE}/800/600?random=23`,
  vegetarian: `${PICSUM_BASE}/800/600?random=24`,
  asian: `${PICSUM_BASE}/800/600?random=25`,
};

// Función para obtener imagen con fallback
export function getImageUrl(type: keyof typeof FOOD_IMAGES, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const baseUrl = FOOD_IMAGES[type];
  
  if (!baseUrl) {
    // Fallback a imagen genérica de restaurante
    return FOOD_IMAGES.restaurant;
  }
  
  // Ajustar tamaño según parámetro para Picsum
  const sizeParams = {
    small: { width: 400, height: 300 },
    medium: { width: 800, height: 600 }, 
    large: { width: 1920, height: 1080 }
  };
  
  const { width, height } = sizeParams[size];
  
  // Para Picsum, extraer el número random y construir nueva URL
  const randomMatch = baseUrl.match(/random=(\d+)/);
  const randomId = randomMatch ? randomMatch[1] : '1';
  
  return `https://picsum.photos/${width}/${height}?random=${randomId}`;
}

// URLs de placeholder como último recurso
export const PLACEHOLDER_IMAGES = {
  food: 'https://via.placeholder.com/800x600/f59e0b/ffffff?text=Comida',
  restaurant: 'https://via.placeholder.com/800x600/ef4444/ffffff?text=Restaurante',
  city: 'https://via.placeholder.com/1200x800/3b82f6/ffffff?text=Ciudad',
  category: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Categoría'
};

// Función principal para obtener imagen segura
export function getSafeImageUrl(type: keyof typeof FOOD_IMAGES, size: 'small' | 'medium' | 'large' = 'medium'): string {
  try {
    return getImageUrl(type, size);
  } catch (error) {
    console.warn(`Error loading image for type ${type}, using placeholder`);
    return PLACEHOLDER_IMAGES.food;
  }
}
