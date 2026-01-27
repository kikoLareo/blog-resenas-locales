import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanContent(content: any): string {
  if (!content) return '';
  
  // Handle Portable Text objects being passed erroneously
  if (typeof content !== 'string') {
    if (Array.isArray(content)) {
      // Very basic Portable Text to string conversion for previews
      return content
        .map(block => block.children?.map((c: any) => c.text).join('') || '')
        .join(' ')
        .replace(/\[\d+(?:†[^\]]*)?\]/g, '').replace(/\[\d+\]/g, '')
        .trim();
    }
    return '';
  }

  // Remove citation markers like [1], [2], [272925892707324†screenshot], etc.
  return content.replace(/\[\d+(?:†[^\]]*)?\]/g, '').replace(/\[\d+\]/g, '').trim();
}

/**
 * Genera la URL correcta para evitar los 404 reportados
 */
export function getVenueUrl(citySlug: string | undefined, venueSlug: string | undefined) {
  if (!citySlug || !venueSlug) return '#';
  // Asegurar que los slugs no contengan la ciudad duplicada si ya viene en el venueSlug
  const cleanVenueSlug = venueSlug.replace(new RegExp(`-${citySlug}$`), '');
  return `/${citySlug.toLowerCase()}/${cleanVenueSlug.toLowerCase()}`;
}

export function getReviewUrl(citySlug: string | undefined, venueSlug: string | undefined, reviewSlug: string | undefined) {
  if (!citySlug || !venueSlug || !reviewSlug) return '#';
  const cleanVenueSlug = venueSlug.replace(new RegExp(`-${citySlug}$`), '');
  return `/${citySlug.toLowerCase()}/${cleanVenueSlug.toLowerCase()}/review/${reviewSlug.toLowerCase()}`;
}
