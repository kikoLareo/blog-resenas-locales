/**
 * URL validation utilities
 */

/**
 * Validates if a string is a valid URL format
 * @param url - The URL string to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') {
    return true; // Empty URLs are allowed (field is not required)
  }

  try {
    // Use URL constructor for validation
    const urlObj = new URL(url);
    // Accept only http and https schemes for safety and consistency
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Gets a user-friendly error message for invalid URLs
 * @param url - The invalid URL string
 * @returns Error message string
 */
export function getUrlErrorMessage(url: string): string {
  if (!url || url.trim() === '') {
    return '';
  }
  
  // Check if it looks like a URL but missing protocol
  if (url.includes('.') && !url.startsWith('http://') && !url.startsWith('https://')) {
    return 'La URL debe comenzar con http:// o https://';
  }
  
  return 'Por favor, introduce una URL válida (ej: https://www.ejemplo.com)';
}