/**
 * Phone number validation utilities for Spanish and international formats
 */

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
}

/**
 * Validates Spanish phone numbers
 * Supports formats:
 * - +34 XXX XXX XXX
 * - 34XXXXXXXXX  
 * - 9XX XXX XXX (Spanish mobile/landline)
 */
export function validateSpanishPhone(phone: string): PhoneValidationResult {
  if (!phone.trim()) {
    return { isValid: true }; // Empty phone is allowed (optional field)
  }

  const cleaned = phone.replace(/\s+/g, '').replace(/[-()]/g, '');
  
  // Spanish international format: +34XXXXXXXXX
  const spanishIntlPattern = /^\+34[679]\d{8}$/;
  if (spanishIntlPattern.test(cleaned)) {
    return { 
      isValid: true, 
      formatted: cleaned.replace(/^\+34(\d{3})(\d{3})(\d{3})$/, '+34 $1 $2 $3')
    };
  }
  
  // Spanish national format: 9XXXXXXXX, 8XXXXXXXX, 7XXXXXXXX, 6XXXXXXXX
  const spanishNationalPattern = /^[6789]\d{8}$/;
  if (spanishNationalPattern.test(cleaned)) {
    return { 
      isValid: true, 
      formatted: cleaned.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3')
    };
  }

  return {
    isValid: false,
    error: 'Formato de teléfono español no válido. Use +34 XXX XXX XXX o 9XX XXX XXX'
  };
}

/**
 * Validates international phone numbers
 * Supports basic international format: +XX XXX XXX XXX
 */
export function validateInternationalPhone(phone: string): PhoneValidationResult {
  if (!phone.trim()) {
    return { isValid: true }; // Empty phone is allowed (optional field)
  }

  const cleaned = phone.replace(/\s+/g, '').replace(/[-()]/g, '');
  
  // International format: +XXXXXXXXXXXX (7-15 digits after country code)
  const internationalPattern = /^\+\d{1,3}\d{6,14}$/;
  if (internationalPattern.test(cleaned)) {
    return { 
      isValid: true, 
      formatted: phone // Keep original formatting for international numbers
    };
  }

  return {
    isValid: false,
    error: 'Formato de teléfono internacional no válido. Use +XX XXX XXX XXX'
  };
}

/**
 * Validates phone number accepting both Spanish and international formats
 */
export function validatePhone(phone: string): PhoneValidationResult {
  if (!phone.trim()) {
    return { isValid: true }; // Empty phone is allowed (optional field)
  }

  // Try Spanish format first
  const spanishResult = validateSpanishPhone(phone);
  if (spanishResult.isValid) {
    return spanishResult;
  }

  // Try international format
  const internationalResult = validateInternationalPhone(phone);
  if (internationalResult.isValid) {
    return internationalResult;
  }

  return {
    isValid: false,
    error: 'Formato de teléfono no válido. Use +34 XXX XXX XXX (España) o +XX XXX XXX XXX (internacional)'
  };
}