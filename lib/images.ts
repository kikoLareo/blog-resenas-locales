import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity.client';
import { SanityImage, ImageConfig } from './types';

// Crear builder de URLs de imágenes
const builder = imageUrlBuilder(client);

/**
 * Generar URL optimizada de imagen Sanity
 */
export function urlFor(source: SanityImage) {
  return builder.image(source);
}

/**
 * Generar URL de imagen con configuración específica
 */
export function getOptimizedImageUrl(
  image: SanityImage,
  config: ImageConfig = {}
): string {
  if (!image?.asset) {
    return '/placeholder-image.jpg'; // Imagen placeholder por defecto
  }

  let imageBuilder = urlFor(image);

  // Aplicar dimensiones
  if (config.width && config.height) {
    imageBuilder = imageBuilder.width(config.width).height(config.height);
  } else if (config.width) {
    imageBuilder = imageBuilder.width(config.width);
  } else if (config.height) {
    imageBuilder = imageBuilder.height(config.height);
  }

  // Aplicar calidad
  if (config.quality) {
    imageBuilder = imageBuilder.quality(config.quality);
  }

  // Aplicar formato
  if (config.format) {
    imageBuilder = imageBuilder.format(config.format);
  }

  // Aplicar modo de ajuste
  if (config.fit) {
    imageBuilder = imageBuilder.fit(config.fit);
  }

  // Aplicar recorte
  if (config.crop) {
    imageBuilder = imageBuilder.crop(config.crop);
  }

  // Aplicar auto-optimizaciones
  if (config.auto === 'format') {
    imageBuilder = imageBuilder.auto('format');
  } else if (config.auto === 'compress') {
    imageBuilder = imageBuilder.auto('format,compress');
  }

  // Aplicar efectos
  if (config.blur) {
    imageBuilder = imageBuilder.blur(config.blur);
  }

  if (config.sharpen) {
    imageBuilder = imageBuilder.sharpen(config.sharpen);
  }

  return imageBuilder.url();
}

/**
 * Generar múltiples tamaños de imagen para responsive
 */
export function generateResponsiveImages(
  image: SanityImage,
  sizes: Array<{ width: number; height?: number; quality?: number }>
): Array<{ url: string; width: number; height?: number }> {
  return sizes.map(size => ({
    url: getOptimizedImageUrl(image, {
      width: size.width,
      height: size.height,
      quality: size.quality || 85,
      format: 'webp',
      auto: 'format',
    }),
    width: size.width,
    height: size.height,
  }));
}

/**
 * Configuraciones predefinidas para diferentes casos de uso
 */
export const IMAGE_PRESETS = {
  // Para hero sections
  hero: {
    width: 1920,
    height: 800,
    quality: 90,
    format: 'webp' as const,
    fit: 'crop' as const,
    crop: 'center' as const,
    auto: 'format' as const,
  },
  
  // Para cards de reseñas
  reviewCard: {
    width: 400,
    height: 300,
    quality: 85,
    format: 'webp' as const,
    fit: 'crop' as const,
    crop: 'center' as const,
    auto: 'format' as const,
  },
  
  // Para galerías
  gallery: {
    width: 800,
    height: 600,
    quality: 85,
    format: 'webp' as const,
    fit: 'crop' as const,
    crop: 'center' as const,
    auto: 'format' as const,
  },
  
  // Para thumbnails
  thumbnail: {
    width: 150,
    height: 150,
    quality: 80,
    format: 'webp' as const,
    fit: 'crop' as const,
    crop: 'center' as const,
    auto: 'format' as const,
  },
  
  // Para Open Graph
  openGraph: {
    width: 1200,
    height: 630,
    quality: 90,
    format: 'jpg' as const,
    fit: 'crop' as const,
    crop: 'center' as const,
    auto: 'format' as const,
  },
  
  // Para avatars
  avatar: {
    width: 100,
    height: 100,
    quality: 85,
    format: 'webp' as const,
    fit: 'crop' as const,
    crop: 'faces' as const,
    auto: 'format' as const,
  },
  
  // Para banners
  banner: {
    width: 1200,
    height: 400,
    quality: 90,
    format: 'webp' as const,
    fit: 'crop' as const,
    crop: 'center' as const,
    auto: 'format' as const,
  },
  
  // Para listados
  listing: {
    width: 300,
    height: 200,
    quality: 80,
    format: 'webp' as const,
    fit: 'crop' as const,
    crop: 'center' as const,
    auto: 'format' as const,
  },
} as const;

/**
 * Generar URL usando preset predefinido
 */
export function getPresetImageUrl(
  image: SanityImage,
  preset: keyof typeof IMAGE_PRESETS
): string {
  return getOptimizedImageUrl(image, IMAGE_PRESETS[preset]);
}

/**
 * Generar srcSet para imágenes responsive
 */
export function generateSrcSet(
  image: SanityImage,
  widths: number[] = [400, 800, 1200, 1600],
  quality: number = 85
): string {
  return widths
    .map(width => {
      const url = getOptimizedImageUrl(image, {
        width,
        quality,
        format: 'webp',
        auto: 'format',
      });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Generar imagen con placeholder LQIP
 */
export function getImageWithPlaceholder(image: SanityImage) {
  const mainUrl = getOptimizedImageUrl(image, {
    width: 800,
    quality: 85,
    format: 'webp',
    auto: 'format',
  });
  
  const placeholderUrl = image.asset.metadata?.lqip || 
    getOptimizedImageUrl(image, {
      width: 20,
      quality: 20,
      format: 'jpg',
      blur: 2,
    });

  return {
    src: mainUrl,
    placeholder: placeholderUrl,
    alt: image.alt || '',
    width: image.asset.metadata?.dimensions?.width,
    height: image.asset.metadata?.dimensions?.height,
  };
}

/**
 * Generar configuración completa para Next.js Image
 */
export function getNextImageProps(
  image: SanityImage,
  config: ImageConfig & { 
    sizes?: string;
    priority?: boolean;
    className?: string;
  } = {}
) {
  const {
    width = 800,
    height,
    quality = 85,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    priority = false,
    className,
    ...imageConfig
  } = config;

  const optimizedUrl = getOptimizedImageUrl(image, {
    width,
    height,
    quality,
    format: 'webp',
    auto: 'format',
    ...imageConfig,
  });

  return {
    src: optimizedUrl,
    alt: image.alt || '',
    width,
    height: height || Math.round(width * 0.75), // Ratio 4:3 por defecto
    sizes,
    priority,
    className,
    placeholder: 'blur' as const,
    blurDataURL: image.asset.metadata?.lqip || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
  };
}

/**
 * Obtener información de imagen para SEO
 */
export function getImageSEOData(
  image: SanityImage,
  config: { width?: number; height?: number } = {}
) {
  const { width = 1200, height = 630 } = config;
  
  return {
    url: getOptimizedImageUrl(image, {
      width,
      height,
      quality: 90,
      format: 'jpg',
      fit: 'crop',
      crop: 'center',
      auto: 'format',
    }),
    width,
    height,
    alt: image.alt || '',
  };
}

/**
 * Generar URLs para diferentes dispositivos
 */
export function generateDeviceImages(image: SanityImage) {
  return {
    mobile: getOptimizedImageUrl(image, IMAGE_PRESETS.listing),
    tablet: getOptimizedImageUrl(image, IMAGE_PRESETS.reviewCard),
    desktop: getOptimizedImageUrl(image, IMAGE_PRESETS.gallery),
    hero: getOptimizedImageUrl(image, IMAGE_PRESETS.hero),
  };
}

/**
 * Validar si una imagen es válida
 */
export function isValidImage(image: any): image is SanityImage {
  return (
    image &&
    typeof image === 'object' &&
    image.asset &&
    typeof image.asset === 'object' &&
    typeof image.asset._id === 'string' &&
    typeof image.asset.url === 'string'
  );
}

/**
 * Obtener dimensiones originales de imagen
 */
export function getImageDimensions(image: SanityImage) {
  return {
    width: image.asset.metadata?.dimensions?.width || 800,
    height: image.asset.metadata?.dimensions?.height || 600,
    aspectRatio: image.asset.metadata?.dimensions?.aspectRatio || 1.33,
  };
}

/**
 * Calcular dimensiones manteniendo aspect ratio
 */
export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number
) {
  const aspectRatio = originalWidth / originalHeight;
  
  if (maxWidth && maxHeight) {
    const maxRatio = maxWidth / maxHeight;
    
    if (aspectRatio > maxRatio) {
      // Imagen más ancha, limitar por ancho
      return {
        width: maxWidth,
        height: Math.round(maxWidth / aspectRatio),
      };
    } else {
      // Imagen más alta, limitar por alto
      return {
        width: Math.round(maxHeight * aspectRatio),
        height: maxHeight,
      };
    }
  }
  
  if (maxWidth) {
    return {
      width: maxWidth,
      height: Math.round(maxWidth / aspectRatio),
    };
  }
  
  if (maxHeight) {
    return {
      width: Math.round(maxHeight * aspectRatio),
      height: maxHeight,
    };
  }
  
  return { width: originalWidth, height: originalHeight };
}